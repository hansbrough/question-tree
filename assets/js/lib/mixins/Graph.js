//Define an AMD module
//Graph Helpers

define(['underscore','jquery'],
  function (_,$) {

    var _Mixin = function(options){
      options = options || {};

      this.initialize(options);
    };

    _Mixin.prototype = {
      initialize: function(options){
        this.options  = options || {};
        this.store    = null;
        this.modules  = null;

        _.bindAll(this,'digest');

        this.fetch(options.graph_name);
      },
      fetch: function(config_name){
        //console.log("Graph"," fetch");
        config_name = config_name || 'index.js';
        var api_url = '/data/graph/'+config_name;

        $.ajax({
              url: api_url,
              type: 'GET',
              dataType: 'json',
              contentType: "application/json; charset=utf-8",
              headers: {}
            }).done( this.digest );
      },
      digest: function(resp){
        //console.log("Graph"," digest:",resp);
        this.store = resp.data || resp || {};
        this.modules = _.without( _.keys(this.store), 'meta');
      },
      getFirstQuestionInModule: function(modId){
        //console.log("Graph"," getFirstQuestionInModule:",modId);
        return (modId && this.store && this.store[modId]) ? this.store[ modId ].questions[0] : null;
      },
      getId: function(){
        return (this.store && this.store.meta) ? this.store.meta.graph_id : null;
      },
      getModuleByQid: function(qid){
        //console.log("Graph"," getModuleByQid:",qid);
        var mod;
        for(var i in this.store){
          var questions = this.store[i].questions;
          if(questions){
            var len = questions.length;
            for(var x =0;x<len;x++){
              if(qid === questions[x].id){
                mod = this.store[i];
                break;
              }
            }
          }
        }
        return mod;
      },
      getModuleIdByQuestionSetid: function(QuestionSetid){
        //console.log("Graph"," getModuleIdByQuestionSetid:",QuestionSetid);
        var modId;
        for(var i in this.store){
          var questions = this.store[i].questions;
          if(questions){
            for(var x =0;x<questions.length;x++){
              if(QuestionSetid === questions[x].id){
                modId = i;
                break;
              }
            }
          }
        }
        return modId;
      },
      getModuleTitleById: function(id){
        return (this.store && id && this.store[id]) ? this.store[id].title : null;
      },
      /*
      * Given a current module find the next module
      * 1. use 'next' value from current module in graph or
      * 2. if no 'next' property use next module by index
      * 3. else use first module.
      */
      getNextModuleId: function(currentModuleId){
        //console.log("Graph", " getNextModuleId currentModuleId:",currentModuleId);
        //console.log("...this.modules: ",this.modules);
        var currentIdx, id;
        if(this.store && this.store[currentModuleId] && this.store[currentModuleId].next){
          //console.log("...use 'next' property from graph to determine module id");
          id = this.store[currentModuleId].next;
        }else if(currentModuleId){
          currentIdx = _.indexOf(this.modules, currentModuleId);
          //console.log("...currentIdx:",currentIdx);
          id = this.modules[currentIdx+1] || null;
        }else{
          id = this.modules[0];
        }
        //console.log("......next module id:",id);
        return id;
      },
      /*
      * given a module id and question id determine the next question.
      */
      getNextModuleQuestion: function(modId, questionId){
        //console.log("Graph", " getNextModuleQuestion: ",modId, questionId);
        var questionSequence  = this.getQuestionsByModuleId(modId);
        var question          = _.find(questionSequence, function(item) { return item.id === questionId });
        return question;
      },
      /*
      * determine the total number of questions in the graph
      * (not inclusive of conditional questions)
      */
      getQuestionCount: function(){
        //console.log("Graph", " getQuestionCount");
        var cnt = 0;
        this.modules.forEach( function(module){
          //console.log('.... number questions:',this.GRF.store[module].questions.length);
          cnt = cnt + this.store[module].questions.length;
        }, this);
        //console.log("...cnt:",cnt);
        return cnt;
      },
      /*
      * return question object given a question id
      */
      getQuestionById: function(id){
        //console.log("Graph", " getQuestionById:",id);
        var question = null;
        if(id){
          for(var i in this.store){
            var questions = this.store[i].questions;
            if(questions){
              var len = questions.length;
              for(var x =0;x<len;x++){
                if(id === questions[x].id){
                  //console.log("...found graph question");
                  question = questions[x];
                  break;
                }
              }
            }
          }

        }
        return question;
      },
      getQuestionsByModuleId: function(id){
        return (this.store && this.store[id]) ? this.store[id].questions : null;
      },
      /*
      * given a start point node for a conditional path - return the squential path end node
      * TODO: this is a work in progress... not working yet.
      */
      getSequentialEndPoint: function(question){
        //console.log("Graph"," getSequentialEndPoint:", question);
        //console.log("...previous question:",question.previous);
        //var graphQuestion = this.getQuestionFromGraphById(question.previous);
        var graphQuestion = this.getQuestionById(question.previous);
        var module   = this.getModuleByQid(question.previous);
        //console.log("......graphQuestion",graphQuestion);
        //console.log("......module",);
        var orderedModQuestions = module.questions.map(function(a){return a.id});
        var endPtIdx = orderedModQuestions.indexOf(graphQuestion.next);
        //console.log("......endPtIdx:",endPtIdx);
        var conditionalReentryPt = orderedModQuestions.indexOf(question.next);
        //console.log("......conditionalReentryPt:",conditionalReentryPt);
        //console.log("........delta:",endPtIdx - conditionalReentryPt);
      }
    }

    return _Mixin
})
