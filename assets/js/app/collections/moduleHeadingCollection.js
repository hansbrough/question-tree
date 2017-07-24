define([
  'underscore',
  'backbone',
  'mixins/PubSub',
  'app/models/SurveyHeadingModel'
], function(_, Backbone, PubSub, Model){
    var Collection = Backbone.Collection.extend({
      model: Model,
      initialize: function(options){
        this.on('add',function(model){//triggered after a successful fetch
          //console.log('...collection add event: ',model);
        });
        //
        //Object.assign(this, PubSub);

        //listen to custom events
        //this.listenTo( Backbone, 'module:change', this.reset );
        PubSub.subscribe('module:change', this.reset.bind(this) );
      }
    });

    return Collection;
});
