//
//

//Establish global namespace
var QUESTIONNAIRE = {};

require(['app/Survey.App'],
function(app) {
  //console.log("...All files loaded.");
  QUESTIONNAIRE = app;
  QUESTIONNAIRE.start();

});
