//
//

//Establish global namespace
var QUESTIONNAIRE = {};

require(['app/Quiz.App'],
function(app) {
  //console.log("...All files loaded.");
  QUESTIONNAIRE = app;
  QUESTIONNAIRE.start();

});
