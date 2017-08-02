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

#### Graph and Questions Helper Files

These files are used by the decisionTree logic to help with tasks like determining which is the current question node and what comes next etc. The Graph and Questions files also handle fetching your json files (via the HTML5 fetch api) and storing the results locally. By design only the decisionTree uses these files, not the view logic which does not need to know about the inner workings of path branching. In general the Graph.js file provides info specific to the graph json while Questions.js does the same for the questions json.

#### DecisionTree

This file combines information about the graph and questions json to determine a path through the question set. It should be instantiated and used by the View logic to determine the 'next' and 'previous' question nodes. The decisionTree logic simply guides the way from the first question to the last it does not try to do other tasks like persisting user answers.

#### View Logic
Use your own presentation files that create the quiz / survey UI or use the Backbone/Marionette files included here as an example.

The example presentation related files included here use the requirejs, AMD style module loading which by convention starts with main.js ( located at `/assets/js/` ). The decisionTree file is instantiated within `/assets/js/controller.js` where there are also two views instantiated which do the UI work. The views associated collections also keep a copy of each question node answered and augment with user answers, how many times viewed etc. A unique screen at the end of the quiz displays a summary of the user results and offers tips about how to do better.

### Path Branching Overview

A _**Base Path**_ is the sequential route through nodes in a graph which avoids any conditional paths. The diagram below has a _Graph Length_ of 4 nodes.

![Image of Base Path](https://user-images.githubusercontent.com/658255/28881940-98624038-775e-11e7-9a4e-c1672a51cd81.png)


A _**Conditional Path**_ - an optional, offshoot path that exposes users to extra questions or allows skipping questions in the Base Path.

A _**Detour Path**_ - a type of Conditional Path which exposes users to _additional_ questions. In the diagram below if a user took the optional detour branch then the _Graph Length_ is 4 nodes else the Graph Length would be 3 nodes.

![Image of Detour Path](https://user-images.githubusercontent.com/658255/28882908-7f1ab4d6-7761-11e7-8c29-af40f5cd2af2.png)

A _**Shortcut Path**_ - a type of Conditional Path that allows users to _bypass_ questions on the Base Path. In the diagram below the _Graph Length_ is only 2 nodes if the shortcut is used.

![Image of Shortcut Path](https://user-images.githubusercontent.com/658255/28883099-294ebac4-7762-11e7-8e54-0b982504954f.png)

A _**Multi-Node Path**_ - path containing more than one node. Almost all Sequential paths will be multi-node. Conditional Paths might often contain just a single node. The diagram below shows a multi-node detour path with a graph length of 5 nodes.

![Image of MultiNode Path](https://user-images.githubusercontent.com/658255/28883656-0bdc5f26-7764-11e7-8308-d2ccc0bae480.png)

A _**Multi-Branch Path**_ - node from which multiple, conditional paths are available to choose from.

![Image of MultiNode Path](https://user-images.githubusercontent.com/658255/28884089-69aa222c-7765-11e7-8b3e-12ab5f657393.png)

A _**Compound Conditional Path**_ - A Conditional Path with nested, conditional paths.

![Image of MultiNode Path](https://user-images.githubusercontent.com/658255/28884380-6d912060-7766-11e7-8ab9-da45c038dab2.png)
