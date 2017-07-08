/* global App, localStorage, CRICKET, window */
/*jshint bitwise: false*/
define([
  'marionette',
  'app/views/QuestionView',
  /*'hope/views/ModuleHeadingView',*/
  'decision_tree',
  'backbone.radio'],

  function(Marionette, QuestionView, Tree, Radio){

    //ingest cookies if no cookie object in app yet.
    var _setCookies = function(){
      //console.log("_setCookies");
      if(!CRICKET.cookie.state_cricket){
        CRICKET.ingestCookies();
      }
    };

    //set timestamp of last login request
    var lastAuthTime = null;
    var _setLastAuthTime = function(){
      //console.log("_setLastAuthTime");
      lastAuthTime = new Date().getTime();
    };

    //determine if /login request should be prevented from running
    var _requestShouldBeThrottled = function(){
      //console.log("_requestShouldBeThrottled");
      var currTime  = new Date().getTime(),
          ttl,
          throttle;
      if(!CRICKET.cookie.state_cricket || !lastAuthTime){
        throttle = false;
      }else{
        //throttle if curr time is less than lastAuthTime + ttl
        ttl = CRICKET.cookie.state_cricket.ttl
        throttle = (currTime <= lastAuthTime + ttl);
      }
      //console.log("...throttle:",throttle);
      return throttle;
    }

    /*
    * get theme string for the current org
    * note: not sure where this should live. not possible to put in the Marionette Application object yet.
    */
    var _requestAppTheme = function(){
      var token   =  localStorage.getItem('idToken'),
          api_url = '/app/theme';

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
              Backbone.trigger('app:theme:fetched', resp.data);
            }
          });
    };

    var learnChannel = Radio.channel('learn');

    //this backbone controller also provides a proxy for App.js
    var Controller = Marionette.Object.extend({
      channelName: 'app',
      radioEvents: {
        'login:complete': 'handleLoginComplete',
        'login:started': 'handleLoginStarted'
      },
      initialize: function (options) {
        console.info("Survey Controller", " initialize w/options:",options);
        this.options = options || {};
        this.cricketAuthInProgress = null;
        //this.queue = new Queue();
        this.views = {};

        _.bindAll(this,'index','initialize','handleLoginComplete');
        //_.extend(this, new JwtHelper(), new XHRHelper() );

        Backbone.listenTo(Backbone, 'account:authenticated', _requestAppTheme);

        //is a login in process?
        /*
        if(Backbone.Queue && Backbone.Queue.indexOf('app:login:started') !== -1 ){
          this.handleLoginStarted()
        }
        */

        //check auth status early.
        this.emitIsAuthenticated();
      },
      initializeSurveyViews: function(){
        console.info('initializeSurveyViews');
        if(!CRICKET.Survey){
          //initialize the Decision Tree
          //todo:find better way to reference the parent application object - not by instantiated name
          CRICKET.Survey = new Tree({
            defaultScreen:'opening',
            //graph_name:'ucsf_ckd_graph',//optional
            //question_set_name:'ucsf_ckd_questions',//optional
            token: localStorage.getItem('idToken') || null
          });
        }
        if( !this.views.QuestionView ){
          this.views.QuestionView = new QuestionView({el:'[data-component=survey]', defaultNextSection:CRICKET.postSurveyScreen});
          this.views.HeadingView = new HeadingView({el:'[data-component=survey]', defaultModule:'opening'});
        }else{
          Backbone.trigger('survey:reloaded', {});
        }
      },
      initializeAppNavView: function(){
        if( !this.views.AppNavView ){
          this.views.AppNavView = new AppNavView({el:'[data-component=app-topbar]'});
        }else{
          //group views created previously - trigger a redisplay of whats existing in collections.
          Backbone.trigger('tab:reloaded', {});
        }
      },
      /*
      * fwd to a section of app based on state cookie
      * most recent user state will be fetched and set into cookie before fwding
      */
      index: function(){
        console.log('BB INDEX controller cricketAuthInProgress:',this.cricketAuthInProgress);
        var _routeFunc = (function () {

          this.routeHandler.call(this,
            function(){
              _setLastAuthTime();
              _setCookies();
              if(!this.cricketAuthInProgress){
                //console.log("......cricketAuth Not InProgress");
                //goto: 1. unfinished survey 2. email campaign 3. land target feature switch
                if(CRICKET.cookie.state_cricket){
                  var campaign        = CRICKET.cookie.state_cricket.campaign,
                      surveyComplete  = !!CRICKET.cookie.state_cricket.survey;
                  //console.log("survey:",!!CRICKET.cookie.state_cricket.survey," campaign:",CRICKET.cookie.state_cricket.campaign," land_target:",CRICKET.cookie.state_cricket.land_target);
                  if(surveyComplete && !campaign){
                    CRICKET.setPostSurveyScreen();
                    CRICKET.Router.navigate('/'+CRICKET.postSurveyScreen, {trigger: true});
                  }else if(surveyComplete && campaign){
                    CRICKET.setCampaignScreen();
                    CRICKET.Router.navigate('/'+CRICKET.campaignScreen, {trigger: true});
                  }else{
                    //console.log('cookie says...survey not complete');
                    CRICKET.Router.navigate('/introduction', {trigger: true});
                  }
                }
              }else{
                //don't run index route until authenticated
                //console.log("don't run index route just yet");
                //this.queue.add('index');
              }
            }.bind(this)
          );

        }).bind(this);

        //note: give Chrome enough time to write to localStorage upon login. :)
        window.setTimeout(_routeFunc, 0);//yes, 0ms

      },
      /*
      * Use this to optionally extend route handlers with a JWT check and
      * retrieval via login endpoint of most recent user state info (cookie will be updated)
      * conditionally throttle login calls based on a ttl cookie value
      */
      routeHandler: function(fn){
        //console.log("routeHandler ",fn);
        if( this.getJwtIsCurrent() ){
          if( !_requestShouldBeThrottled() ){
            this.POST({
              url:'/account/login',
              cb:fn
            });
          }else{
            fn();
          }
        }else{
          App.load('logout');
        }
      },
      /*
      * route handler always loads intro page but only inits views if user authenticated.
      * this prevents app from attempting to fetch data associated with views until needed.
      * route is part of cb url triggered after authentication (when token exists) so views will
      * be intialized eventually.
      */
      introduction: function(){
        console.log('BB INTRODUCTION page controller');
        //this.routeHandler.call(this,
          //function(){
            //_setLastAuthTime();
            CRICKET.setPostSurveyScreen();
            //App.load('introduction');
            this.initializeSurveyViews();
          //}.bind(this)
        //);
      },
      emitIsAuthenticated: function(){
        //console.log("emitIsAuthenticated");
        //Backbone.trigger('account:authenticated', this.getJwtIsCurrent() && !this.cricketAuthInProgress );
      },
      choices: function(topic){
        //console.log('BB Choices route:', topic);
        if(topic){
          var _page = topic+'_choices';
          //console.log('... _page: ',_page);
          App.load(_page);
        }else{
          App.load('activity_choices');
        }
      },
      /*
      * When login is complete - run any handler in the queue
      * reset flag that tracks if login in progress
      * redirect to logout screen on failure
      */
      handleLoginComplete: function(status){
        //console.log("Controller"," handleLoginComplete ",status);
        //var routeHandlerStr = this.queue.pop();//just grab last item (for now its the only one)
        this.cricketAuthInProgress = false;
        if(status === 'success'){
          //console.log("...routeHandlerStr:",routeHandlerStr);
          if(routeHandlerStr && this[routeHandlerStr]){
            this[routeHandlerStr]();
          }
        }else{
          this.logout();
        }
      },
      handleLoginStarted: function(){
        //console.log("Controller"," handleLoginStarted");
        this.cricketAuthInProgress = true;
      },
      logout: function(forward){
        //console.log("controller"," logout", " forward:",forward);
        localStorage.clear();
        CookieManager.deleteCookie('state_cricket');
        App.load('logout', {forward:forward});
      },
      question: function(topic, idx){
        //console.log("BB Question route handler:",topic,' : ', idx);
        //var qid = topic+'_'+idx;
        CRICKET.Survey.find(topic, idx);
      }
    });

    return Controller;
});
