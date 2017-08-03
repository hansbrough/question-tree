/* global QUESTIONNAIRE */
define([
  'marionette',
  'app/views/QuestionView',
  'app/views/ModuleHeadingView',
  'decisionTree'],

  function(Marionette, QuestionView, HeadingView, Tree){
    var Controller = Marionette.Object.extend({
      initialize: function (options) {
        this.options = options || {};
        this.views = {};
        _.bindAll(this,'index','initialize');
      },
      initializeSurveyViews: function(){
        //console.info("controller"," initializeSurveyViews");
        if(!QUESTIONNAIRE.DecisionTree){
          //initialize the Decision Tree
          //todo:find better way to reference the parent application object - not by instantiated name
          //note: decisionTree config.graph_name, & .question_set_name are optional values
          QUESTIONNAIRE.DecisionTree = new Tree({
            defaultScreen:'opening',
            //graph_name:'/data/graph/sequential',
            //graph_name:'/data/graph/detour',
            graph_path:'/data/graph/succulent_id',
            //question_set_name:'/data/questions/sequential',//use with 'sequential' graph
            //question_set_name:'/data/questions/shortcut',//use with 'sequential' graph
            //question_set_name:'/data/questions/detour',//use with 'detour' graph
            //question_set_name:'/data/questions/detour_multinode'//use with 'detour' graph
            //question_set_name:'/data/questions/detour_multinode_multibranch'//use with 'detour' graph
            //question_set_name:'/data/questions/detour_compound'//use with 'detour' graph
            //question_set_name:'/data/questions/detour_mixed'//use with 'detour' graph
            question_set_path:'/data/questions/succulent_id'//use with 'succulent_id' graph
          });
        }
        if( !this.views.QuestionView ){
          this.views.QuestionView = new QuestionView({el:'[data-component=survey]', defaultNextSection:QUESTIONNAIRE.postSurveyScreen});
          this.views.HeadingView = new HeadingView({el:'[data-component=survey]', defaultModule:'opening'});
        }else{
          Backbone.trigger('survey:reloaded', {});
        }
      },
      index: function(){
        QUESTIONNAIRE.Router.navigate('/introduction', {trigger: true});
      },
      /*
      * route handler always loads intro page but only inits views if user authenticated.
      * this prevents app from attempting to fetch data associated with views until needed.
      * route is part of cb url triggered after authentication (when token exists) so views will
      * be intialized eventually.
      */
      introduction: function(){
        //console.log('BB INTRODUCTION page controller');
        this.initializeSurveyViews();
      }
    });

    return Controller;
});
