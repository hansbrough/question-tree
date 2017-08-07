define([
  'marionette',
  'app/controller',
],

  function(Marionette, Controller){

    var Router = Marionette.AppRouter.extend({
        appRoutes: {
          '': 'index',
          'introduction': 'introduction'
        },
        initialize: function(options){
          console.log("Router initialize:",options);
          this.controller = new Controller(options);
        }
      });

    return Router;
});
