define([
  'underscore',
  'backbone',
  'app/models/QuestionModel'
], function(_, Backbone, Model){
    var Collection = Backbone.Collection.extend({
      model: Model,
      parse: function(response, options){
        //console.log('parse', response);
        //return options.parseField ? response[options.parseField] : response;
      },
      initialize: function(options){
        //console.log('Question Collection initialize');
        this.on('add',function(model){//triggered after a successful fetch
          //console.log('...collection add event: ',model);

        });

        //listen to custom events
        this.listenTo( Backbone, 'question:change', this.catch );
        this.listenTo( Backbone, 'questionSet:answered', this.setAnswerIds );
        this.listenTo(Backbone, 'question:bools:updated', this.setBoolAnswerValues);
        this.listenTo(Backbone, 'question:text:updated', this.setTextAnswerValue);
      },
      catch: function(payload){
        //this proxy here to pass the 'merge' option
        //which will ensure the collection's "change" evt is triggered
        //console.log("questionCollection" ," catch:",payload);
        this.add(payload, {merge:true});
      },
      /*
      * Add the answer id passed back from db after user has answered a question.
      */
      setAnswerIds: function(payload){
        //console.log('collection setAnswerIds: ',payload);
        var questions     = payload.questions,
            questionSetId = payload.questionSetId,
            model;

        if(questionSetId){
          model = this.findWhere({'id': payload.questionSetId});

          for(var i = 0; i < questions.length; i++){
            var item = questions[i],
                labels   = model.get('labels'),
                len      = labels.length;

            for(var x =0; x<len; x++){
              if( parseInt(item.questionId) === parseInt(labels[x].qid) ){
                labels[x].answerId = item.answerId;
                break;
              }
            }
            //update labels attribute.
            model.set({'labels':labels});

          }
        }
      },
      /*
      * Save question answer values set in UI.
      * e.g. when user selects an item in a radio button group update all the group values
      */
      setBoolAnswerValues: function(payload){
        //console.log('collection setBoolAnswerValues: ',payload);
        for(var i = 0; i < payload.length; i++){
          var item = payload[i];
          if(item.questionSet){
            var model       = this.findWhere({'id': item.questionSet}),
                questions   = model.get('labels'),
                len         = questions.length;

            for(var x =0; x<len; x++){
              if(item.singleQuestion){//yes/no question - all qids same in this set. look for matching value instead.
                questions[x].singleQuestion = true;
                delete questions[x].answerValue;//remove existing values for all inputs in group.
                if( item.answerVal === questions[x].value){
                  questions[x].answerValue = (item.answerVal === '1') ? 'T':'F';//normalize to string expected by endpoint.
                }
              }
              else if( parseInt(item.questionId) === parseInt(questions[x].qid) ){//all qids unique.
                questions[x].answerValue = item.answerVal;
                break;
              }
            }
            //update labels attribute in collections model
            model.set({'labels':questions});
          }
        }
      },
      setTextAnswerValue: function(payload){
        //console.log("setTextAnswerValues");
        var questionSetId = payload.questionSet;
        if(questionSetId){
          var model = this.findWhere({'id': questionSetId});
          model.set({'answerValue':payload.answerVal},{silent:true});
        }
      }
    });

    return Collection;
});
