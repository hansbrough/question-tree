define([
  'marionette',
  'app/controller',
],

  function(Marionette, Controller){
    console.log('CRICKET.App Router Load');

    var Router = Marionette.AppRouter.extend({
        appRoutes: {
          '': 'index',
          'introduction': 'introduction',
          'choices/:topic': 'choices',
          'choices/:topic/:idx': 'question'
        },
        initialize: function(options){
          //console.log("Router initialize:",options);
          this.controller = new Controller(options);
        }
      });

    return Router;
});
