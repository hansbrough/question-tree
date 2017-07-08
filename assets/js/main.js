//
//

//Establish global namespace
var SURVEY = {};

require(['app/Survey.App'],
function(app) {
  console.log("...All files loaded.");
  SURVEY = app;
  //SURVEY.start();

});
