## Question Graph

A project that uses a json formatted graph and json formatted questions to navigate conditional paths through a quiz or survey.

### Overview of the Pieces

* Question Graph json - defines a base path (order) of questions
* Question definitions json - defines the questions themselves as well as optional rules about order.
* Graph.js and Questions.js - contain convenience methods for performing operations on the json data.
* DecisionTree.js - provides information to your js application such as what's the next or previous question.
* Quiz / Survey etc App files - Consumer of the above and files associated with the appearance and behavior of your Quiz. (these files are included here to give an example of how to use the DecisionTree) 
