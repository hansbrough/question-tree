## Question Graph

A project that uses a json formatted graph and json formatted questions to navigate conditional paths through a quiz or survey.

### Overview of the Pieces

* Question Graph json - defines a base path (order) of questions
* Question definitions json - defines the questions themselves as well as optional rules about order.
* Graph.js and Questions.js - contain convenience methods for performing operations on the json data.
* DecisionTree.js - provides information to your js application such as what's the next or previous question.
* Quiz / Survey etc App files - Consumer of the above and files associated with the appearance and behavior of your Quiz. (these files are included here to give an example of how to use the DecisionTree but you can substitute your own versions)

### Graph and Question Json Formatting examples

#### Example Graph File
```javascript
{
  "meta":{
    "graph_id":"1"
  },
  "module_plantClassification":{
    "title":"Plant Classification",
    "questions": [
      {"id":"plantClassification_1"}
    ],
    "next":"module_plantId"
  },
  "module_plantId":{
    "title":"Plant Identification",
    "questions": [
      {"id":"plantId_1", "next":"plantId_2"},
      {"id":"plantId_2", "next":"plantId_3"},
      {"id":"plantId_3"}
    ],
    "next":"module_final"
  },
  "module_final":{
    "title":"Wrapping Up",
    "questions": [
      { "id":"survey_results"}
    ]
  }
}
````
There are a few things to note about the above. First - the questions are grouped by 'modules' - for example there are three defined above: 'plantClassification', 'plantId' and 'final'. This lets authors logically group questions and optionally define paths between modules with the 'next' property. By default the decisionTree will move through modules in order so strictly speaking the module level 'next' properties above are not needed. Next - each module contains a list of question id's which correspond to definitions in the Questions json. Modules and questions in Graph file define a sequential _Base Path_ without branching. Lastly the 'meta' section above will be ignored by the decisionTree when determining order of questions - it's just a place to keep info about the graph itself for example versioning.

#### Example Questions File

````javascript
{
  "plantClassification_01":{
    "title":"What genus does this plant most likely belong to?",
    "media": [
      {"type":"image", "src":"/assets/img/a_celsii.jpg"}
    ],
    "labels":[
      {"title":"Aloe", "qid":"100", "next":"plantClassification_11"},
      {"title":"Agave", "qid":"101"},
      {"title":"Sempervivum", "qid":"102", "next":"plantClassification_13"},
      {"title":"Gasteria", "qid":"103", "next":"plantClassification_14"},
      {"title":"Echeveria", "qid":"104", "next":"plantClassification_12"},
      {"title":"Haworthia", "qid":"105", "next":"plantClassification_15"}
    ],
    "actual":"101",
    "category":"quiz",
    "criterion":"agave",
    "type":"radio"
  },
  "favColors_85":{
    "title":"What colors look good in the kitchen",
    "labels":[
      {"title":"Blue", "qid":"5"},
      {"title":"Green", "qid":"6"},
      {"title":"Yellow", "qid":"7"},
      {"title":"Red", "qid":"8"}
    ],
    "category":"survey",
    "criterion":"kitchen",
    "type":"checkbox"
  }
}
````
Note how the 'plantClassification_01' has been defined above. The 'labels' property is an array of options associated with question. Because this question node is categorized as a 'quiz' there is a correct answer specified with the 'actual' property. The 'type' property indicates that the options should be rendered as radio button controls. The 'criterion' property acts as a metadata tag for use by any application logic needing to summarize user responses. The 'media' property is an array of images etc that may be displayed in the UI. There are examples of using these properties to define a UI in the app logic views (created via Backbone/Marionette)

A deceivingly simple looking property 'next' on label members is how branching can be defined between questions. More specifically _conditional paths_ can be created which will either add to or substract from the Base Path graph length. For example question nodes can be added by specifying a 'next' property which points at a question not defined in the _Base Path_. In other words from the example above the option `{"title":"Sempervivum", "qid":"102", "next":"plantClassification_13"}` will add add the 'plantClassification_13' node to the stack of questions visible to the user (assuming it's defined). Upon completion, unless 'plantClassification_13' itself defines a next question, the user will be returned to the _Base Path_ which in the case of the graph file example would be 'plantId_1' (since its the first question in the next module). Similarly _Shortcut Paths_ can be created by setting a question's 'next' value equal to a node on the _Base Path_ more than a single hop away. For example jumping from 'plantId_1' directly to 'plantId_3'. There are more variations on conditional paths which will be covered later.

Finally any question definitions like 'favColors_85' not referenced in the _Base Path_ or directly from other questions will be ignored.
