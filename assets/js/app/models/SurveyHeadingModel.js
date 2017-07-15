//
//
define([
  'backbone'
], function(Backbone){
  var Model = Backbone.Model.extend({
    defaults: {
      id:'',
      title:''
    }
  });
  // Return the model for the module
  return Model;
});
