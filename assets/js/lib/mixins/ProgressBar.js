//Define an AMD module
// Progress Bar

define(['underscore','jquery','mixins/PubSub'],
  function (_,$,PubSub) {

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
        //listen for custom events
        PubSub.subscribe('question:change', this.update.bind(this) );
      },
      update: function(e){
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
