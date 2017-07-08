//number of users who have published from the app over a given time period
//
define([
  'backbone'
], function(Backbone){
  var Model = Backbone.Model.extend({
    defaults: {
      id:'',
      labels:[],
      module:'',
      next:'',
      title:'',
      type:''
    }
  });
  // Return the model for the module
  return Model;
});
