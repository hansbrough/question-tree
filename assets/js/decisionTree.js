// Decision Tree
// uses Graph and Question methods to determine user flow through Survey / Quiz

define(['underscore', 'mixins/Graph', 'mixins/Questions', 'mixins/PubSub'],
  function (_, GraphHelpers, QuestionsHelpers, PubSub) {

    //Private props etc
    var _GRF              = null;
    var _QTN              = null;
    var _runningDelta     = 0;
    var _currentModuleId  = null;
    var _currentQuestion  = null;
    var _defaultScreen    = null;
    var _history          = [];

    /* --- Private Methods --- */
    /*
    * for conditional paths return length
    */
    var _getPathDelta = function(question){
      var delta = 0;
      if(question && question.conditional){
        //console.log("DecisionTree"," getPathDelta: ",question);
        var targetQuestionInBasePath = _GRF.getIsQidInBasePath(question.id);
        var firstConditional = _QTN.getFirstConditionalInPath(question);
        var basePathEndPt = _GRF.getSequentialEndPoint(firstConditional);
        //console.log("......basePathEndPt:",basePathEndPt);
        var conditionalPathEndPt = firstConditional.id;
        //console.log("......conditionalPathEndPt",conditionalPathEndPt);
        var basePathEndPtIdx = _GRF.getIdxOfQidInModule(basePathEndPt);
        var conditionalPathEndPtIdx = _GRF.getIdxOfQidInModule(conditionalPathEndPt);
        var conditionalPathEndPtDefined = _QTN.getNodeById(conditionalPathEndPt);
        //console.log("......basePathEndPtIdx:",basePathEndPtIdx);
        //console.log("......conditionalPathEndPtIdx:",conditionalPathEndPtIdx);
        //console.log("......QTN.getNodeById():",_QTN.getNodeById(conditionalPathEndPt))
        //determine path type - TODO:pull out into own method
        if(basePathEndPt && basePathEndPtIdx >= 0){
          if(conditionalPathEndPtIdx >= 0){//Shortcut
            //console.log("......straight shortcut");
            delta = basePathEndPtIdx - conditionalPathEndPtIdx;
          } else if(targetQuestionInBasePath){//Shortcut (from mixed path)
            //console.log("......mixed shortcut");
            delta = basePathEndPtIdx - _GRF.getIdxOfQidInModule(question.id);
          } else if(conditionalPathEndPtDefined){//Detour
            //console.log("......Detour Path, ",conditionalPathEndPt," defined just not in current module.")
            delta = 1;
          }
        }else if(!basePathEndPt && conditionalPathEndPtDefined){//detour off last base path node
          //console.log("......detour off last base path node");
          delta = 1;
        }else {
          console.log("......... unknown path type!");
        }


      }
      //console.log("...delta:",delta);
      return delta;
    };

    /*
    * return object with current question index and the total question count.
    * account for conditional questions by setting current idx to items in history.
    */
    var _getQuestionPosition = function(question){
      //console.log("DecisionTree"," getQuestionPosition: ", question);
      var position    = {current:_history.length, total:_getTotalQuestionCount(question)};
      //console.log("...position:",position);
      return position;
    };

    var _getTotalQuestionCount = function(question){
      //console.log("DecisionTree"," getTotalQuestionCount");
      _updateRunningDelta(question);
      var cnt = _GRF.getBasePathLength();
      cnt += _runningDelta;
      return cnt;
    };

    /*
    * based on questonObj determine which level of 'next' we should use - from graph or questions
    * return object with id and a conditional value if next question is conditional (not from module graph)
    */
    var _getNextQuestionId = function(question, options){
      options = options || {};
      //console.log("getNextQuestionId: ",question, options);
      var payload = {id:null};
      var labelIdx  = options.labelIdx;

      if(_.isNumber(labelIdx) && question.labels && question.labels[labelIdx] && question.labels[labelIdx].next){
        //console.log("... conditional by labelIdx: ",labelIdx);
        payload.id = question.labels[labelIdx].next;
        payload.conditional = true;
      }else if(question.next){
        //console.log("... by graph");
        payload.id = question.next;
      }else if(question.conditional){
        //console.log("... no next value. return to base path.");
        question = _QTN.getFirstConditionalInPath(question);
        payload.id = _GRF.getSequentialEndPoint(question);
      }
      payload.module = _GRF.getModuleIdByQid(payload.id);
      //console.log("......payload:",payload);
      return payload;
    };

    /*
    * uses graph store to return object based on 'next' question id from 'config' arg.
    * by default uses 'next' question id from the current question.
    */
    var _getNextQuestionFromGraph = function(config){
      //console.log("DecisionTree"," getNextQuestionFromGraph config:",config);
      var nextQuestionId = (config) ? config.id : _currentQuestion.next;
      //if next question obj passed in ... determine it's sequential 'next' question
      var question      = _GRF.getNextModuleQuestion(_currentModuleId, nextQuestionId);
      var nextQuestion  = (question && question.next) ? {next:question.next} : {};
      //console.log("..... returning:",nextQuestion);
      return nextQuestion;
    };

    var _setCurrentModuleId = function( mod_id ){
      //console.log("setCurrentModuleId",mod_id);
      _currentModuleId = mod_id;
      var data = { id:mod_id, title:_GRF.getModuleTitleById(mod_id) };
      PubSub.publish('module:change',data);
    };

    var _setCurrentQuestion = function(question){
      //console.log("DecisionTree", "setCurrentQuestion:",question);
      if(question){
        _setHistory('add', question);//add qid to history stack.
        var prevQuestionId  = (_currentQuestion) ? _currentQuestion.id : _defaultScreen;
        question = _.extend(question, {previous:prevQuestionId});
        var positionData    = _getQuestionPosition(question);

        //console.log("...positionData:",positionData);
        //determine if is second to last and last question.
        if( positionData.total / positionData.current === 1){
          //console.log("......this is the last question");
          _.extend(question, {last:true});
        }
        if( positionData.total - positionData.current === 1){
          //console.log("......this is the penultimate question")
          _.extend(question, {penultimate:true});
        }

        _currentQuestion = _.extend(question, {position:positionData});
        //console.log("... currentQuestion has been extended with 'previous' property");
        _QTN.update(_currentQuestion);//sync questions store

        PubSub.publish('question:change', _currentQuestion);
      }
    };

    var _setHistory = function(verb, obj){
      //console.log('setHistory:',verb, obj);
      switch(verb){
        case 'add':
          _history.push( obj.id );
          break;
        case 'delete':
          _history = _history.slice(0, _history.length - 1);//remove current question.
          break;
      }
      return _history;
    };

    var _updateRunningDelta = function(question){
      //console.log("DecisionTree"," updateRunningDelta");
      var pathDelta = _getPathDelta(question);
      _runningDelta += pathDelta;
      //console.log("...",_runningDelta);
    };

    /*--- Constructor ---*/
    var _Mixin = function(options){
      //console.log('DecisionTree Constructor');
      options = options || {};
      this.initialize(options);
    };

    _Mixin.prototype = {
      initialize: function(options){
        //console.log("DecisionTree", " initialize:" ,options);
        var baseUrl = options.base_url || '';
        var graphPath = (options.graph_path) ? options.base_url + options.graph_path : null,
            questionSetPath = (options.question_set_path) ? baseUrl + options.question_set_path : null;

        _defaultScreen = options.defaultScreen || 'introduction';
        //intialize Graph and Question Helper Mixins
        _GRF = new GraphHelpers({'config_path':graphPath});
        _QTN = new QuestionsHelpers({'config_path':questionSetPath,'base_url':baseUrl});
      },

      //return the next question (object)
      next: function(config){
        //console.log("DecisionTree"," next:", config);
        var question = {views:0};
        if( !_currentQuestion ){//0 case. first question.
          //console.log("...first question");
          _setCurrentModuleId( _GRF.getNextModuleId() );
          var firstModuleQuestion = _GRF.getFirstQuestionInModule(_currentModuleId);
          _.extend(question, firstModuleQuestion, {first:true});
          //console.log("......",question);
        }else{//find next question within current module
          //console.log("..._currentQuestion:",_currentQuestion);
          var nextModuleId    = _GRF.getNextModuleId( _currentModuleId ),
              nextQuestionObj  = _getNextQuestionId( _currentQuestion, config );
          //console.log("...nextModuleId:",nextModuleId," nextQuestionObj:",nextQuestionObj);
          if(nextQuestionObj.id){//use next question in this module
            //console.log("...currentQuestion is followed by another question in same module");
            var graphNextQuestion = _getNextQuestionFromGraph(nextQuestionObj);
            _.extend(question, nextQuestionObj, graphNextQuestion);
          }else if(nextModuleId && nextModuleId !== 'module_final'){//jump to next module
            //console.log("...go to next module");
            _setCurrentModuleId( nextModuleId );
            var firstModuleQuestion = _GRF.getFirstQuestionInModule(nextModuleId);
            _.extend(question, firstModuleQuestion);
          }else{//account for last module.
            //currently there is not much difference between this and previous, non-final condition.
            //console.log("...graph complete");
            _setCurrentModuleId( nextModuleId );
            var firstModuleQuestion = _GRF.getFirstQuestionInModule(nextModuleId);
            _.extend(question, firstModuleQuestion);
            PubSub.publish('survey:complete', {});
          }
        }
        //console.log('... question before being extended: ',question);
        if(question){
          _.extend(question, _QTN.getNodeById(question.id), { module : _currentModuleId }, config);
          question.views++;
          //console.log('..... question after being extended a second time: ',question);
        }
        _setCurrentQuestion(question);
        //console.log(".........next:", question);
        return question;
      },
      prev: function(){
        console.log('prev');
        var question  = null,
            len       = _history.length;
        if( len > 0 ){
          _setHistory('delete');
          //console.log('...', _history);
          question = _QTN.getNodeById( _history.pop() );
        }
        //keep internal state in sync w/UI change
        //console.log('... ',question);
        question.views++;
        _setCurrentQuestion(question);//add question back as currentQuesion
        _setCurrentModuleId( question.module );

        return question;
      },

    };

    return _Mixin;
  });
