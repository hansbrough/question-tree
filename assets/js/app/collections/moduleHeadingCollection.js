define([
  'underscore',
  'backbone',
  'app/models/SurveyHeadingModel'
], function(_, Backbone, Model){
    var Collection = Backbone.Collection.extend({
      model: Model,
      initialize: function(options){
        this.on('add',function(model){//triggered after a successful fetch
          //console.log('...collection add event: ',model);
        });

        //listen to custom events
        this.listenTo( Backbone, 'module:change', this.reset );
      }
    });

    return Collection;
});
