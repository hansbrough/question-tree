/* global App, window */
//Define an AMD module
//loads the Marionette dependency which in turn loads it's dependency Backbone and so on...

define([
  'backbone',
  'marionette',
  'app/router',
  'mixins/ProgressBar'
  ],
  function (Backbone, Marionette, Router, Progress) {
    console.log("Survey.App Load");
    var appName, eduTopic;

    var _App    = Marionette.Application.extend({
      appName: appName,
      channelName: 'app',
      radioEvents: {
        'cookie:update': 'handleCookieUpdate'
      },
      cookie:{},
      el:'.cricket-app',
      theme:null,
      Progress: new Progress(),
      postSurveyScreenLUT:{'DEFAULT':'introduction'},
      campaignScreenLUT:{'DEFAULT':'discuss'},
      initialize: function(options){
        //console.log("Hope.App initialize");
        this.$el = $(this.el);
        this.Router = new Router({appName:appName,eduTopic:eduTopic});
      },
      handleCookieUpdate: function(evt){
        //console.log("App handleCookieUpdate evt:",evt);
        this.ingestCookies();
      },
      setCampaignScreen: function(){
        //console.log("QUESTIONNAIRE.App"," setCampaignScreen");
        var screenObj = {campaignScreen:this.campaignScreenLUT.DEFAULT};
        if(this.cookie.state_cricket && this.cookie.state_cricket.campaign){
          screenObj.campaignScreen = this.campaignScreenLUT[this.cookie.state_cricket.campaign] || this.campaignScreenLUT.DEFAULT;
        }
        _.extend(this, screenObj);
      },
      /*
      * set what screen follows survey based on cookie state
      */
      setPostSurveyScreen: function(){
        //console.log("QUESTIONNAIRE.App"," setPostSurveyScreen");
        var screenObj = {postSurveyScreen:this.postSurveyScreenLUT.DEFAULT};
        _.extend(this, screenObj);
      },
      setTheme: function(value){
        //console.log("QUESTIONNAIRE.App"," setTheme");
        if(value && value !== ''){
          this.theme = value;
          Backbone.trigger('app:theme:set', value);
        }
      }
    });

    //instantiate app
    var QUESTIONNAIRE  = new _App();

    QUESTIONNAIRE.on('start', function(){
      console.log("QUESTIONNAIRE"," Started");
      Backbone.history.start();
      Backbone.trigger('app:started');
    });

    //Listen to custom events
    Backbone.listenTo(Backbone, 'app:theme:fetched', function(name){
      //console.log("app:theme:fetched",name);
      if(name && name !== ''){
        QUESTIONNAIRE.setTheme(name);
      }
    });

    Backbone.listenTo( Backbone, 'app:theme:set', function(value){
      //console.log("QUESTIONNAIRE.App"," setThemeInUI");
      QUESTIONNAIRE.$el.addClass('theme-'+value);
    });

    Backbone.listenTo( Backbone, 'render:question', function(payload){
      //update url history when new question is rendered.
      var route = payload.id.split('_');
      QUESTIONNAIRE.Router.navigate('choices/'+route[0]+'/'+route[1]);
    });

  return QUESTIONNAIRE;
});
