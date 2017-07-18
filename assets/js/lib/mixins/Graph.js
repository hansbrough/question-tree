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
        console.log("Graph"," fetch");
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
      getModuleIdByQuestionSetid: function(QuestionSetid){
        console.log("Graph"," getModuleIdByQuestionSetid:",QuestionSetid);
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
        console.log("...modId:",modId);
        return modId;
      }
    }

    return _Mixin
})
