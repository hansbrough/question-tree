//Define an AMD module
//Question Helper Methods
//depends on html5 fetch api

define(['underscore'],
  function (_) {
    var _Mixin = function(options){
      options = options || {};

      this.initialize(options);
    };

    _Mixin.prototype = {
      initialize: function(options){
        this.options  = options || {};
        this.store    = null;

        _.bindAll(this,'digest');

        this.fetch(options.config_path);
      },
      digest: function(resp){
        //console.log("Questions"," digest:",resp);
        this.store = resp.data || resp || {};
      },
      fetch: function(config_url){
        config_url = (config_url || '/data/questions/index') + '.json';
        fetch(config_url,{method:'get'}).then(function(resp){ return resp.json() }).then(this.digest);
      },
      /*
      * return which of a question's predecessors was first in a conditional branch.
      * an arg (question object) that is non-conditional is returned as a no-op.
      * useful for multi-node, conditional branches
      * ex. sequence of 'plantId_1' -> 'plantId_5'(cond) -> 'plantId_6'(cond)
      * will return 'plantId_5' question obj when method passed 'plantId_6' question obj
      */
      getFirstConditionalInPath: function(question){
        //console.log("Questions"," getFirstConditionalInPath: ",question);
        var node = question;
        if(question.conditional){
          //console.log("...question is conditional ------ what was previous? ",question.previous);
          var prevQuestion = this.getNodeById(question.previous);
          if(prevQuestion.conditional){
            //console.log("... continue look back")
            node = this.getFirstConditionalInPath(prevQuestion);//continue recursive look back.
          }else{
            //console.log("...done")
            node = question;
          }

        }
        return node;
      },
      getNodeById: function(id){
        //console.log("Questions"," getNodeById: ",id);
        return (id && this.store)? this.store[id] : null;
      },
      getQuestionInSetByQid: function(set, qid, options){
        //console.log("Questions"," getQuestionInSetByQid: ",set, qid, options);
        var len = set.length,
            q = null;
        while(len--){
          //console.log('... len:',len);
          if( qid === parseInt(set[len].qid) ){
            if(options){
              //console.log('.... extending set with options: ', options);
              _.extend(set[len], options);
            }
            q = set[len];
            //console.log('.... found match.');
            break;
          }
        }
        return q;
      },
      /*
      * Update the question set with changes.
      */
      update: function(question){
      //console.log("Questions"," update: ", question);
        var _id = question.id;
        this.store[_id] = question;
      }
    }

    return _Mixin
  });
