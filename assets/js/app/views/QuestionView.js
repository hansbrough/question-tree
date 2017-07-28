/*global _cc */

/* global QUESTIONNAIRE, window, localStorage, _platform, navigator */
/*
* Search Results View
* includes handler logic for all dom nodes
* todo: conditionally include result template based on app name
*/

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'marionette_overrides',
  'app/collections/questionCollection',
  'text!/assets/js/app/templates/question.tmpl?noext',
  'text!/assets/js/app/templates/survey_results.tmpl?noext'
  ],
  function($,_,Backbone,Marionette,overrides, Collection, questionTmpl, resultsTmpl){
    //compile and cache the template. register a partial for use in the template.
    Marionette.TemplateCache.storeTemplate('question', questionTmpl);

    var CSS_MOVEIN      = 'moveFromRight',
			  CSS_MOVEOUT     = 'moveToLeft',
        CSS_MOVEBACKIN  = 'moveFromLeft',
        CSS_MOVEBACKOUT = 'moveToRight',
			  CSS_CURRENT     = 'page-current',
        CSS_OFFSCREEN   = 'offscreen',
        CSS_DISABLED    = 'disabled',
        CSS_CHOICE      = 'question-set-container',
        CSS_INTRO       = CSS_CHOICE + '.opening',
        STR_NEXT        = 'next',
        STR_BACK        = 'back',
        CSS_PARENT      = '.content-wrapper.opening';

    var _View = Marionette.View.extend({
        template: Marionette.TemplateCache.get('#question'),
        events:{
          'click #cta_next:not(.disabled)' : 'handleNextButtonClick',
          'click #cta_prev' : 'handleBackButtonClick',
          'click #cta_finish:not(.disabled)' : 'handleFinishButtonClick',
          'change .question-set-container' : 'handleInputChange',
          'keyup .question-set-container textarea' : 'handleTextAreaChange'
        },
        direction: STR_NEXT,
        criterionDisplayNameLUT:null,
        initialize: function(options){
          //console.log("QuestionView", " init");
          this.collection = new Collection();
          this.selectedRadioInputIdx = null;
          this.defaultNextSection = options.defaultNextSection;

          Marionette.TemplateCache.storeTemplate('results', resultsTmpl);

          this.listenTo(this.collection, 'add change', this.determineRenderSource);//not triggered on back btn click.

          //console.log("...",this.collection);
          _.bindAll(this,'initialize','render','handleNextButtonClick','handleBackButtonClick','setSelectedRadioInputIndex','handleReload');

          //listen to custom events
          Backbone.listenTo( Backbone, 'question:inputs:selected', this.setSelectedRadioInputIndex);
          Backbone.listenTo( Backbone, 'survey:reloaded', this.handleReload);
        },
        /*
        *
        */
        calculateQuizResults: function(){
          //console.log("QuestionView"," calculateQuizResults");
          var recordSet = [],
              criteria = {};
          //create criterion count
          _.each(this.collection.models, function(model){
            var questionSetCategory = model.get('category');
            var answerId = model.get('actual');
            var criterion = model.get('criterion');
            if(questionSetCategory === 'quiz'){
              //console.log('...model:',model);
              //console.log("...... criterion:",criterion);
              //check criterion entry exists else create
              criteria[criterion] = criteria[criterion] ? criteria[criterion]: {knowit:0,correct:0,incorrect:[]};
              var userSelected = this.getUserAnswerForRadioBtnQuestion(model);

              if(userSelected.qid === answerId){
                //console.log(".... ",answerId," is correct");
                criteria[criterion].correct++;
              }else{
                //console.log("...question ",model.get('id')," is incorrect");
                criteria[criterion].incorrect.push({id:model.get('id'),response:userSelected});
              }
              //finally update bool indicating topic knowledge
              criteria[criterion].knowit = criteria[criterion].correct > criteria[criterion].incorrect.length;
            }
          }.bind(this));
          //console.log("...criteria: ",criteria);

          //transform criteria to template ready array.
          for(var name in criteria){
            var record = _.extend( { id:name, displayName:name}, criteria[name] );
            recordSet.push(record);
          }
          //console.log("...recordSet: ",recordSet);
          return recordSet;
        },
        /*
        * return set of tip objects w/info to help users do better next time.
        */
        calculateQuizTips: function(results){
          console.log("QuestionView"," calculateQuizTips results:",results);
          var tips = [];
          if(results){
            tips = results.filter(function(item){
              return !item.knowit}).map(function(answer){
                console.log("... incorrect answer:",answer);
                var qid = answer.incorrect[0].id;
                var model = this.collection.get(qid);
                var img_src = model.get('media')[0].src;
                return {correct:answer.displayName, incorrect:answer.incorrect[0].response.title, img_src:img_src, advice:''}
              }.bind(this));


          }
          console.log("...tips:",tips);
          return tips;
        },
        /*
        * given a model find user selected radio btn
        */
        getUserAnswerForRadioBtnQuestion: function(questionModel){
          console.log("getUserAnswerForRadioBtnQuestion");
          var userSelected;
          questionModel.get('labels').forEach(function(label){
            if(label.answerValue === 'T'){
              userSelected = label;
            }
          });
          return userSelected;
        },
        /*
        * Display mechanics of question sets falls into 4 categories:
        * 1. results page which should always be rendered (append new or replace existing)
        * 2. next item which is 'new' (not previously rendered)
        * 3. next item which has previously been rendered
        * 4. previous item which has previously been rendered.
        */
        determineRenderSource: function(model){
          //console.log("QuestionView"," determineRenderSource: ",model);
          //console.log("...module name:",model.get('module'));
          var changedProps = _.keys(model.changed),
              isFinalScreen = model.get('last');

          if(isFinalScreen){
            console.log('...isFinalScreen so re-render:',isFinalScreen);
            var quizResults = this.calculateQuizResults();
            var quizTips    = this.calculateQuizTips(quizResults);
            console.log("......quizResults:",quizResults);
            model.set({results:quizResults,tips:quizTips});
            this.render(model, {replace:true});
          }else if(changedProps.length > 0 && this.direction === STR_NEXT){
            //console.log('...changedProps:',changedProps);
            this.transitionNextExisting( model.toJSON() );
          }else if(this.direction === STR_NEXT){
            //console.log("...next");
            this.render(model);
          }else{
            //console.log("...back");
            this.transitionBack( model.toJSON() );
          }
        },
        /*
        * ensure that a 'unique' input is not selected with any other inputs from the same control group.
        */
        enforceCheckboxUniqueness: function($target, $inputs){
          //console.log("enforceCheckboxUniqueness");
          var i, $currInput;
          if( $target.attr('type') === 'checkbox' ){
            if( $target.attr('data-unique') && $target.prop('checked') ){//unselect sibling inputs
              for(i=0;i<$inputs.length;i++){
                $currInput = $($inputs[i]);
                if( $currInput.attr('id') !== $target.attr('id') ){
                  $currInput.prop('checked', false);
                }
              }
            }else if( !$target.attr('data-unique') && $target.prop('checked') ){//unselect 'unique' input
              for(i=0;i<$inputs.length;i++){
                $currInput = $($inputs[i]);
                if( $currInput.attr('data-unique') ){
                  $currInput.prop('checked', false);
                  break;
                }
              }
            }
          }
        },
        getInputs: function($target){
          //console.log('getSelectedLabels:',$target);
          return $target.closest('.control-group').find('input');
        },
        handleBackButtonClick: function(e){
          //console.log("handleBackButtonClick");
          e.preventDefault();
          this.direction = STR_BACK;
          QUESTIONNAIRE.Survey.prev();
        },
        /*
        * Finish button appears on the last screen
        */
        handleFinishButtonClick: function(e){
          //console.log("QuestionView"," handleFinishButtonClick");
          e.preventDefault();
          var $target = $(e.target),
              href    = $target.attr('href');

          //this.direction = STR_NEXT;
          window.location.href = href;
        },
        /*
        * Handle click event from UI
        * conditionally send config values to decision tree. used to determine question path.
        */
        handleNextButtonClick: function(e){
          //console.log("handleNextButtonClick");
          var config = {};
          if(_.isNumber(this.selectedRadioInputIdx)){
            config.labelIdx = this.selectedRadioInputIdx;
          }
          e.preventDefault();
          this.direction = STR_NEXT;
          QUESTIONNAIRE.Survey.next(config);
        },
        handleInputChange: function(e){
          //console.log("QuestionView"," handleInputChange ");
          var $target = $(e.target),
              $checkedInputs = $target.closest('.control-group').find('input:checked'),
              $inputs = this.getInputs($target),
              valid   = ($checkedInputs && $checkedInputs.length > 0),
              payload = {};

          this.enforceCheckboxUniqueness($target, $inputs);

          if( $target[0].nodeName !== 'TEXTAREA'){
            this.toggleCtaBtn($target, valid);
            payload = this.makePayloadOfInputSet($inputs);
            Backbone.trigger('question:inputs:selected', $inputs);
            Backbone.trigger('question:bools:updated', payload);
          }
        },
        handleReload: function(){
          console.log("QuestionView"," handleReload ");
          //this.$el = $(CSS_PARENT);

          //this.delegateEvents();
        },
        handleTextAreaChange: function(e){
          var $target = $(e.target),
              valid   = $target.val().length > 3,
              payload = this.makePayloadOfTextArea($target);

          Backbone.trigger('question:text:updated', payload);
          this.toggleCtaBtn($target,valid);
        },
        labelsInGroupHaveSameQID: function($inputs){
          //console.log("labelsInGroupHaveSameQID");
          var qids = [];
          $inputs.each( function(idx, node){
            if(qids.indexOf(node.id) < 0){
              qids.push(node.id);
            }
          });
          //console.log("... qids: ",qids);
          return (qids.length === 1);
        },
        makePayloadOfInputSet: function($inputs){
          //console.log("makePayloadOfInputSet: ",$inputs);
          var payload = [],
              isYesNo = this.labelsInGroupHaveSameQID($inputs);

          //todo:below just slightly different - can absctract?
          if(isYesNo){
            $inputs.each( function(idx, node){
              if( $(node).prop('checked') ){
                payload.push({
                  questionId: node.id.split('_')[1],
                  questionSet: node.name,
                  answerVal: $(node).prop('value'),
                  singleQuestion:true
                });
              }
            });
          }else{
            $inputs.each( function(idx, node){
              //console.log('...',$inputs[idx]);
              payload.push({
                questionId: node.id.split('_')[1],
                questionSet: node.name,
                answerVal: ($(node).prop('checked')) ? 'T' : 'F'
              });
            });
          }
          //console.log('...payload:',payload);
          return payload;
        },
        makePayloadOfTextArea: function($textarea){
          //console.log('makePayloadOfTextArea: ',$textarea);
          var payload = {
            questionId: $textarea.attr('id').split('_')[1],
            questionSet: $textarea.attr('name'),
            answerVal: $textarea.val()
          };
          //console.log('...payload:',payload);
          return payload;
        },
        /*
        * display a screen of questions OR the final results screen.
        */
        render: function(model, options){
          //console.log("QuestionView ","render ", " model:",model);
          options = options || {};
          var payload           = model.toJSON(),
              nxtQuestionSetId  = payload.id,
              platform          = ('_platform' in window) ? _platform : {},
              prevQuestionSetId = payload.previous,
              templateFunc      = (payload.last)? Marionette.TemplateCache.get('#results') : this.template,
              markup;
          //console.log("... payload: ",payload);
          //Add extras to payload and create markup from template.
          _.extend(payload, {platform:platform, nextScreen:this.defaultNextSection});
          markup  = templateFunc({SCREEN: payload});
          //choose insertion type.
          if(options.replace){
            //console.log('...replace: ',this.$el.find('.'+nxtQuestionSetId));
            var $existingNode = this.$el.find('.'+nxtQuestionSetId);
            //console.log('... existing node:',$existingNode);
            if($existingNode.length > 0){
              //console.log('.... yeah found it. now replace it.');
              $existingNode.replaceWith( markup );
            }else {
              //console.log('.... not existing yet');
              this.$el.append( markup );
            }
          }else{
            //console.log('... append')
            this.$el.append( markup );
          }

          this.transitionNext(prevQuestionSetId, nxtQuestionSetId);
          Backbone.trigger('render:question',payload);//notify listeners that a new question has been rendered.
        },
        scrollToTop: function(){
          $('html').animate({'scrollTop':0},'slow');
          $('body').animate({'scrollTop':0},'slow');
        },
        /*
        * if radio btn selected save it's index 0 based index within the radio btn group.
        */
        setSelectedRadioInputIndex: function($inputs){
          //console.log('setSelectedRadioInputIndex: ',$inputs);
          var $selected = $inputs.filter(':checked');
          this.selectedRadioInputIdx = ($selected.length === 1 && $selected.attr('type') === 'radio') ? $inputs.index($selected): null;
        },
        toggleCtaBtn: function($target, valid){
          //console.log('toggleCtaBtn',$target, valid);
          var $ctaBtn = $target.closest('.'+CSS_CHOICE).find('.call-to-action');
          if(valid){
            $ctaBtn.removeClass(CSS_DISABLED);
          }else{
            $ctaBtn.addClass(CSS_DISABLED);
          }
        },
        transitionNext: function(currentId, nextId){
          //console.log("transitionNext: ",currentId,"  ",nextId);
          var $current  = this.$el.find('.'+CSS_CHOICE+'.' + currentId),
              $next     = this.$el.find('.'+CSS_CHOICE+'.' + nextId);
          //console.log("...$current:",$current);
          //console.log("...$next:",$next);
          this.scrollToTop();
          $current.addClass(CSS_MOVEOUT).removeClass(CSS_MOVEIN).removeClass(CSS_MOVEBACKIN).removeClass(CSS_CURRENT).removeClass(CSS_MOVEBACKOUT);
          $next.addClass(CSS_MOVEIN).addClass(CSS_CURRENT);

        },
        transitionNextExisting: function(question){
          //console.log("transitionNextExisting: ",question);
          var nextId    = question.id,
              $current  = this.$el.find('.'+CSS_CURRENT),
              $next     = this.$el.find('.'+CSS_CHOICE+'.' + nextId);
          //console.log("...$current:",$current);
          //console.log("...$next:",$next);
          this.scrollToTop();
          $current.addClass(CSS_MOVEOUT).removeClass(CSS_MOVEIN).removeClass(CSS_MOVEBACKIN).removeClass(CSS_CURRENT);
          $next.addClass(CSS_MOVEIN).addClass(CSS_CURRENT).removeClass(CSS_OFFSCREEN).removeClass(CSS_MOVEBACKOUT);
        },
        transitionBack: function(prevQuestion){
          //console.log("transitionBack: ",prevQuestion);
          var $current  = $('.'+CSS_CURRENT);
          $current.removeClass(CSS_MOVEIN).addClass(CSS_MOVEBACKOUT).removeClass(CSS_CURRENT);
          this.scrollToTop();
          //delay to avoid pushing off current question set too quickly.
          window.setTimeout(function(){
            $('.'+CSS_CHOICE+'.' + prevQuestion.id).removeClass(CSS_MOVEOUT).addClass(CSS_MOVEBACKIN).addClass(CSS_CURRENT);
            $current.addClass(CSS_OFFSCREEN);
          }, 600);

        }

    });

    return _View;
});
