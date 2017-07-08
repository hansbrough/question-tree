/*global _cc */

/* global CRICKET, window, localStorage, _platform, navigator */
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
  'text!/assets/js/app/templates/survey_results.tmpl?noext',
  'text!/assets/js/app/templates/survey_introduction.tmpl?noext'
  ],
  function($,_,Backbone,Marionette,overrides, Collection, questionTmpl, hopeResultsTmpl, hopeIntroTmpl, careResultsTmpl){
    //compile and cache the template. register a partial for use in the template.
    Marionette.TemplateCache.storeTemplate('question', questionTmpl);

    var CSS_MOVEIN      = 'moveFromRight',
			  CSS_MOVEOUT     = 'moveToLeft',
        CSS_MOVEBACKIN  = 'moveFromLeft',
        CSS_MOVEBACKOUT = 'moveToRight',
			  CSS_CURRENT     = 'page-current',
        CSS_OFFSCREEN   = 'offscreen',
        CSS_DISABLED    = 'disabled',
        CSS_CHOICE      = 'lifestyle-choice',
        CSS_INTRO       = CSS_CHOICE + '.opening',
        STR_NEXT        = 'next',
        STR_BACK        = 'back',
        CSS_PARENT      = '.content-wrapper.opening';

    var treatmentsView = Marionette.View.extend({
        template: Marionette.TemplateCache.get('#question'),
        events:{
          'click #cta_next:not(.disabled)' : 'handleNextButtonClick',
          'click #cta_prev' : 'handleBackButtonClick',
          'click #cta_finish:not(.disabled)' : 'handleFinishButtonClick',
          'change .lifestyle-choice' : 'handleInputChange',
          'keyup .lifestyle-choice textarea' : 'handleTextAreaChange'
        },
        direction: STR_NEXT,
        criterionDisplayNameLUT:null,
        initialize: function(options){
          //_.extend(this, new ClientEventLogger() );


          //console.log('QuestionView init:',options);
          //console.log('... $el:',this.$el);
          this.collection = new Collection();
          this.selectedRadioInputIdx = null;
          this.defaultNextSection = options.defaultNextSection;

          //pick template based on app name and store
          var appResultsTmpl = (CRICKET.appName === 'cm') ? careResultsTmpl : hopeResultsTmpl;
          Marionette.TemplateCache.storeTemplate('results', appResultsTmpl);
          Marionette.TemplateCache.storeTemplate('intro', hopeIntroTmpl);

          this.requestCriterionDisplayNameLUT();
          this.requestCriterionModalityLUT();
          //note: once hope / care apps are distinct this app sniffing code like this can go away.
          if (CRICKET.appName === 'hope'){
            this.requestIntroduction();
          }
          this.requestExitTemplate();

          this.listenTo(this.collection, 'add change', this.determineRenderSource);//not triggered on back btn click.

          //console.log("...",this.collection);
          _.bindAll(this,'initialize','render','handleNextButtonClick','handleBackButtonClick','persist','makeAnswersPayloadFromCollectionModel',
          'makeTextAnswersPayloadFromCollectionModel','setSelectedRadioInputIndex','setCriterionDisplayNameLUT','setCriterionModalitiesLUT',
          'handleReload','renderIntroduction');

          //listen to custom events
          Backbone.listenTo( Backbone, 'question:inputs:selected', this.setSelectedRadioInputIndex);
          Backbone.listenTo( Backbone, 'criterionDisplayNames:requested', this.setCriterionDisplayNameLUT);
          Backbone.listenTo( Backbone, 'criterionModalities:fetched', this.setCriterionModalitiesLUT);
          Backbone.listenTo( Backbone, 'survey:reloaded', this.handleReload);
          Backbone.listenTo( Backbone, 'survey:introduction:fetched', this.renderIntroduction);
        },
        /*
        * determine ranking of criterion based on user answers
        */
        calculateResultCriteria: function(){
          //console.info('calculateResultCriteria');
          var recordSet = [],
              criteria = {};
          //create criterion count
          _.each(this.collection.models, function(model){
            //console.log('...model:',model.get('labels'));
            model.get('labels').forEach(function(question){
              if(question.answerValue === 'T' && question.criterion){
                //console.log('....',question.criterion);
                criteria[question.criterion] = criteria[question.criterion] ? criteria[question.criterion]+1: 1;
              }
            });
          });

          //transform criteria to template ready array.
          for(var name in criteria){
            var modalityMatches = this.criterionModalitiesLUT[name];
            recordSet.push({ id:name, count: criteria[name], displayName:this.getCriterionDisplayName(name), modalities:modalityMatches });
          }
          //console.log("...recordSet: ",recordSet);
          return recordSet;
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
            //console.log('...isFinalScreen so re-render:',isFinalScreen);
            var resultCriteria = this.calculateResultCriteria();
            model.set({results:resultCriteria});
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
        getCriterionDisplayName: function(name){
          //console.info("getCriterionDisplayNameL ",name);
          var displayName = '';//should we have some default text for troubleshooting?
          if(name && this.criterionDisplayNameLUT){
            displayName = this.criterionDisplayNameLUT[name];
          }
          return displayName;
        },
        getInputs: function($target){
          //console.log('getSelectedLabels:',$target);
          return $target.closest('.control-group').find('input');
        },
        /*
        * Find all questions in set. per question extract id, value, objectize and push into an array.
        * combine with question set and survey data and return in payload object.
        * return null value if answerSet is empty(1)
        */
        getQuestionSetPayload: function(questionSet){
          //console.log("getQuestionSetPayload: ", questionSet);
          var payload = null,
              questionSetId,
              makeAnswersPayloadFunc;

          if(questionSet){
            questionSetId = questionSet.id;
            makeAnswersPayloadFunc = this.getAnswersPayloadFunc(questionSet.type);
            var answerSet = makeAnswersPayloadFunc(questionSetId);
            if(answerSet.length > 0 ){//(1)
              payload = {
                surveyId: CRICKET.Survey.getId(),
                questionSet: questionSetId,
                answerType: this.mapQuestionTypeToAnswerType(questionSet.type),
                answers: answerSet
              };
            }
          }
          return payload;
        },
        handleBackButtonClick: function(e){
          //console.log("handleBackButtonClick");
          e.preventDefault();
          this.direction = STR_BACK;
          this.persist($(e.target));
          CRICKET.Survey.prev();
        },
        /*
        * Finish button appears on the last screen
        */
        handleFinishButtonClick: function(e){
          //console.log("QuestionView"," handleFinishButtonClick");
          e.preventDefault();
          var $target = $(e.target),
              href    = $target.attr('href');

          this.persist($target);
          var surveyUri  = 'survey://'+CRICKET.Survey.getId();
          this.direction = STR_NEXT;
          this.logEvent('surveyComplete', surveyUri, {'userAgent': navigator.userAgent});
          CRICKET.setCookie('state_cricket',{'survey':1});
          //lastly - go to screen specified in target or fallback to the discuss screen.
          if(href){
            window.location.href = href;
          }else{
            CRICKET.Router.navigate('/discuss', {trigger: true});
          }
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
          this.persist($(e.target));
          CRICKET.Survey.next(config);
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
          //console.log("QuestionView"," handleReload ");
          this.$el = $(CSS_PARENT);

          this.delegateEvents();
        },
        handleTextAreaChange: function(e){
          var $target = $(e.target),
              valid   = $target.val().length > 3,
              payload = this.makePayloadOfTextArea($target);

          Backbone.trigger('question:text:updated', payload);
          this.toggleCtaBtn($target,valid);
        },
        /*
        * determine if question is of a type that should be saved.
        */
        isPersistable: function(question){
          //console.log("isPersistable: ",question);
          var candidate     = (question && question.type) ? question.type : 'unknown',
              questionTypes = {radio:true,checkbox:true,textarea:true,summary:false};
          return questionTypes[candidate];
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
        /*
        * return the correct function to create a answers payload based on question type.
        */
        getAnswersPayloadFunc: function(questionType){
          //console.log("getAnswersPayloadFunc: ",questionType);
          var func;
          switch(questionType){
            case 'radio':
            case 'checkbox':
              func = this.makeAnswersPayloadFromCollectionModel;
              break;
            case 'textarea':
              func = this.makeTextAnswersPayloadFromCollectionModel;
              break;
          }
          return func;
        },
        /*
        * Examine a given collection model and return an array of question objects w/their pertinents.
        * only add to array if question has an answer (1)
        * add answerId if exists (question answered previously)
        */
        makeAnswersPayloadFromCollectionModel: function(questionSetId){
          //console.log("makeAnswersPayloadFromCollectionModel: ",questionSetId);
          var questionSetResults = [],
              model = this.collection.findWhere({'id':questionSetId}),
              labels = model.get('labels');
          //console.log("...model:",model);
          labels.map( function(label){
            if( !_.isUndefined(label.answerValue) ){//(1)
              questionSetResults.push({
                qid:label.qid,
                val:label.answerValue,
                aid:label.answerId
              });
            }
          });
          //console.log("... questionSetResults: ",questionSetResults);
          return questionSetResults;
        },
        makeTextAnswersPayloadFromCollectionModel: function(questionSetId){
          //console.log("makeTextAnswersPayloadFromCollectionModel: ",questionSetId);
          var model = this.collection.findWhere({'id':questionSetId});
          return [{
            qid:model.get('qid'),
            val:model.get('answerValue'),
            aid:model.get('answerId'),
          }];
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
        * translate type of questions found in a question set to a string format expected by endpoint.
        */
        mapQuestionTypeToAnswerType: function(questionType){
          //console.log("QuestionView"," mapQuestionTypeToAnswerType ",questionType);
          var answerType;
          switch(questionType){
            case 'radio':
            case 'checkbox':
              answerType = 'BOOLEAN';
              break;
            case 'textarea':
              answerType = 'TEXT';
              break;
            default:
              console.info('Unknown question type. Cannot map to an answer type.');
              answerType = null;
              break;
          }

          return answerType;
        },
        persist: function($target){
          //console.log('persist: ',CRICKET.Survey.getCurrentQuestion());
          var account_url = '/survey/answers',
              token       = localStorage.getItem('idToken') || null,
              questionSet = CRICKET.Survey.getCurrentQuestion(),
              payload;

          //not all screens will have questions / answers that need to be persisted e.g. final results page.
          if( this.isPersistable(questionSet) ){
            payload = this.getQuestionSetPayload(questionSet);
            if(payload){
              $.ajax({
                    url: account_url,
                    xhrFields: {
                      withCredentials: true
                    },
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    headers: {
                      'Authorization': 'Bearer '+ token
                    },
                    data: JSON.stringify(payload),
                    type: 'POST'
                  }).done( function(resp){
                    //console.log(" ... resp:",resp);
                    Backbone.trigger('questionSet:answered', resp.data);
                  }).fail( function(resp){
                    //console.log(" ... failure resp:",resp);
                  });

              var events = [];
              var questionSetURI = _cc.uriPrefix + payload.surveyId + "/" + payload.questionSet + "/";
              for (var i = 0; i < payload.answers.length; i++) {
                var answer = payload.answers[i];
                //console.log("QuestionView", answer);
                var object = questionSetURI + "question/" + answer.qid;
                var answerId = answer.aid ? (questionSetURI + "answer/" + answer.aid) : undefined;
                events.push({
                  "predicate": "answeredSurveyQuestion",
                  "object": object,
                  "prepositions": {
                    "answerId": answerId,
                    "answer": answer.val,
                    "userAgent": navigator.userAgent
                  }
                });
              }
              this.logEvents(events);
            }else{
              console.info('no persist request made due to empty payload.');
            }
          }
        },
        /*
        * display a screen of questions OR the final results screen.
        */
        render: function(model, options){
          //console.log("QuestionView ","render");
          options = options || {};
          var payload           = model.toJSON(),
              nxtQuestionSetId  = payload.id,
              platform          = ('_platform' in window) ? _platform : {},
              prevQuestionSetId = payload.previous,
              templateFunc      = (payload.last)? Marionette.TemplateCache.get('#results') : this.template,
              markup;
          //console.log("... payload: ",payload);
          //conditionally override w/an org specific results template
          if(payload.last && Marionette.TemplateCache.templateCaches['#org_survey_results']){
            templateFunc = Marionette.TemplateCache.get('#org_survey_results');
          }
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
            this.$el.append( markup );
          }

          this.transitionNext(prevQuestionSetId, nxtQuestionSetId);
          Backbone.trigger('render:question',payload);//notify listeners that a new question has been rendered.
        },
        renderIntroduction: function(data){
          //console.log("renderIntroduction:",data);
          this.$el.find('.'+CSS_INTRO).html( Marionette.TemplateCache.get('#intro')({SCREEN: data}) );
        },
        requestCriterionModalityLUT: function(config_name){
          //console.log("QuestionView"," requestCriterionModalityLUT");
          config_name = config_name || 'ckd_criteria_modality';
          var api_url   = '/survey/lut/'+config_name,
              token     = localStorage.getItem('idToken') || null;

          $.ajax({
                url: api_url,
                type: 'GET',
                xhrFields: {
                  withCredentials: true
                },
                headers: {
                  'Authorization': 'Bearer '+ token
                },
              }).done( function(resp){
                Backbone.trigger('criterionModalities:fetched', resp.data);
              });
        },
        requestCriterionDisplayNameLUT: function(config_name){
          //console.log("QuestionView"," requestCriterionDisplayNameLUT");
          config_name = config_name || 'ckd_criteria_name';
          var api_url   = '/survey/lut/'+config_name,
              token     = localStorage.getItem('idToken') || null;

          $.ajax({
                url: api_url,
                xhrFields: {
                  withCredentials: true
                },
                headers: {
                  'Authorization': 'Bearer '+ token
                },
                type: 'GET'
              }).done( function(resp){
                Backbone.trigger('criterionDisplayNames:requested', resp.data);
              });
        },
        requestExitTemplate: function(){
          //console.log("requestExitTemplate");
          var token   =  localStorage.getItem('idToken'),
              api_url = '/survey/template/survey_exit';

          $.ajax({
                url: api_url,
                type: 'GET',
                xhrFields: {
                  withCredentials: true
                },
                headers: {
                  'Authorization': 'Bearer '+ token
                }
              }).done( function(resp){
                if(resp.success){
                  //cache the template for later use
                  Marionette.TemplateCache.storeTemplate(resp.data.name, resp.data.template);
                }
              });
        },
        requestIntroduction: function(){
          //console.log("QuestionView"," requestIntroduction");
          var token   =  localStorage.getItem('idToken'),
              api_url = '/survey/introduction';

          $.ajax({
                url: api_url,
                type: 'GET',
                xhrFields: {
                  withCredentials: true
                },
                headers: {
                  'Authorization': 'Bearer '+ token
                }
              }).done( function(resp){
                if(resp.success){
                  Backbone.trigger('survey:introduction:fetched', resp.data);
                }
              });
        },
        scrollToTop: function(){
          $('html').animate({'scrollTop':0},'slow');
          $('body').animate({'scrollTop':0},'slow');
        },
        setCriterionDisplayNameLUT: function(value){
          //console.log("setCriterionDisplayNameLUT: ",value);
          if(value){
            this.criterionDisplayNameLUT = value;
          }
        },
        setCriterionModalitiesLUT: function(value){
          //console.log("setCriterionModalitiesNameLUT: ",value);
          if(value){
            this.criterionModalitiesLUT = value;
          }
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
    // Our module now returns our view
    return treatmentsView;
});
