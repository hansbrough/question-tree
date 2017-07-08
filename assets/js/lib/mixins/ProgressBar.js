//Define an AMD module
// Progress Bar

define(['underscore','jquery','backbone'],
  function (_,$,Backbone) {

    var CSS_BAR = 'progress.bar';

    var Bar = function(options){
      options = options || {};
      //this.$el = $(CSS_BAR);
      this.initialize(options);
    };

    Bar.prototype = {
      initialize: function(options){
        this.options = options || {};
        this.options.delay = this.options.delay || 500;

        _.bindAll(this, 'update');
        //hook up event listening
        _.extend(this, Backbone.Events);
        //listen for custom events
        this.listenTo( Backbone, 'question:change', this.update );
      },
      update: function(e){
        //note: can't currently save node references because of the way App.js works.
        //which is why we are grabbing node refs each time handlers run.
        var timeoutID, percentage;
        if(e.position){
          percentage = (e.position.current / e.position.total) * 100;
          timeoutID = window.setTimeout(function(){
            $(CSS_BAR).attr('value', percentage);
          }, this.options.delay);
        }
      }
    }

    return Bar
});
