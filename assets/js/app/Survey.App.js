/* global App, window */
//Define an AMD module

define([
  'backbone',
  'marionette',
  'app/router',
  'mixins/ProgressBar'
  ],
  function (Backbone, Marionette, Router, Progress) {

    var _App  = Marionette.Application.extend({
      el:'.cricket-app',
      Progress: new Progress(),
      postSurveyScreenLUT:{'DEFAULT':'introduction'},

      initialize: function(options){
        this.$el = $(this.el);
        this.Router = new Router();
      }
    });

    //instantiate app
    var QUESTIONNAIRE  = new _App();

    QUESTIONNAIRE.on('start', function(){
      //console.log("QUESTIONNAIRE"," Started");
      Backbone.history.start();
      Backbone.trigger('app:started');
    });

    //Listen to custom events
    Backbone.listenTo( Backbone, 'render:question', function(payload){
      //update url history when new question is rendered.
      var route = payload.id.split('_');
      QUESTIONNAIRE.Router.navigate('choices/'+route[0]+'/'+route[1]);
    });

  return QUESTIONNAIRE;
});
