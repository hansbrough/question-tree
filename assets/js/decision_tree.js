// Decision Tree
// uses Graph and Question methods to determine user flow through Survey / Quiz

define(['underscore', 'mixins/Graph', 'mixins/Questions', 'mixins/PubSub'],
  function (_, GraphHelpers, QuestionsHelpers, PubSub) {

    //constructor
    var _Mixin = function(options){
      //console.log('DecisionTree Constructor');
      options                       = options || {};
      this.currentModuleId          = null;
      this.currentQuestion          = null;
      this.currentModuleQuestionIdx = null;
      this.history                  = [];
      this.GRF                      = null;
      this.QTN                      = null;
      this.runningDelta             = 0;

      this.initialize(options);
    };

    _Mixin.prototype = {
      initialize: function(options){
        //console.log("DecisionTree", " initialize:" ,options);
        var graphName = options.graph_name || null,
            questionSetName = options.question_set_name || null;

        this.defaultScreen = options.defaultScreen || 'introduction';

        //intialize Graph and Question Helper Mixins
        this.GRF = new GraphHelpers({'graph_name':graphName});
        this.QTN = new QuestionsHelpers({'config_name':questionSetName});

        //extend
        //Object.assign(this, PubSub);
        _.extend(this, PubSub);
      },
      getCurrentQuestion: function(){
        return this.currentQuestion;
      },
      /*
      * for conditional paths return length
      */
      getPathDelta: function(question){
        var delta = 0;
        if(question && question.conditional){
          //console.log("DecisionTree"," getPathDelta: ",question);
          var targetQuestionInBasePath = this.GRF.getIsQidInBasePath(question.id);
          var firstConditional = this.QTN.getFirstConditionalInPath(question);
          var basePathEndPt = this.GRF.getSequentialEndPoint(firstConditional);
          //console.log("......basePathEndPt:",basePathEndPt);
          var conditionalPathEndPt = firstConditional.id;
          //console.log("......conditionalPathEndPt",conditionalPathEndPt);
          var basePathEndPtIdx = this.GRF.getIdxOfQidInModule(basePathEndPt);
          var conditionalPathEndPtIdx = this.GRF.getIdxOfQidInModule(conditionalPathEndPt);
          var conditionalPathEndPtDefined = this.QTN.getNodeById(conditionalPathEndPt);
          //console.log("......basePathEndPtIdx:",basePathEndPtIdx);
          //console.log("......conditionalPathEndPtIdx:",conditionalPathEndPtIdx);
          //console.log("......QTN.getNodeById():",this.QTN.getNodeById(conditionalPathEndPt))
          //determine path type - TODO:pull out into own method
          if(basePathEndPt && basePathEndPtIdx >= 0){
            if(conditionalPathEndPtIdx >= 0){//Shortcut
              //console.log("......straight shortcut");
              delta = basePathEndPtIdx - conditionalPathEndPtIdx;
            } else if(targetQuestionInBasePath){//Shortcut (from mixed path)
              //console.log("......mixed shortcut");
              delta = basePathEndPtIdx - this.GRF.getIdxOfQidInModule(question.id);
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
        console.log("...delta:",delta);
        return delta;
      },
      /*
      * based on questonObj determine which level of 'next' we should use - from graph or questions
      * return object with id and a conditional value if next question is conditional (not from module graph)
      */
      getNextQuestionId: function(question, options){
        options = options || {};
        //console.log("getNextQuestionId: ",question, options);
        var payload = {id:null};
        if(_.isNumber(options.labelIdx) && question.labels && question.labels[options.labelIdx] && question.labels[options.labelIdx].next){
          //console.log("... conditional by labelIdx: ",options.labelIdx);
          payload.id = question.labels[options.labelIdx].next;
          payload.conditional = true;
        }else if(question.next){
          //console.log("... by graph");
          payload.id = question.next;
        }else if(question.conditional){
          //console.log("... no next value. return to base path.");
          question = this.QTN.getFirstConditionalInPath(question);
          payload.id = this.GRF.getSequentialEndPoint(question);
        }
        payload.module = this.GRF.getModuleIdByQid(payload.id);
        //console.log("......payload:",payload);
        return payload;
      },
      getTotalQuestionCount: function(question){
        console.log("DecisionTree"," getTotalQuestionCount");
        this.updateRunningDelta(question);
        var cnt = this.GRF.getBasePathLength();
        cnt += this.runningDelta;
        return cnt;
      },
      /*
      * return object with current question index and the total question count.
      * account for conditional questions by setting current idx to items in history.
      */
      getQuestionPosition: function(question){
        //console.log("DecisionTree"," getQuestionPosition: ", question);
        var position    = {current:this.history.length, total:this.getTotalQuestionCount(question)};
        //console.log("...position:",position);
        return position;
      },
      /*
      * uses graph store to return object based on 'next' question id from 'config' arg.
      * by default uses 'next' question id from the current question.
      */
      getNextQuestionFromGraph: function(config){
        //console.log("DecisionTree"," getNextQuestionFromGraph config:",config);
        var nextQuestionId = (config) ? config.id : this.currentQuestion.next;
        //if next question obj passed in ... determine it's sequential 'next' question
        var question      = this.GRF.getNextModuleQuestion(this.currentModuleId, nextQuestionId);
        var nextQuestion  = (question && question.next) ? {next:question.next} : {};
        //console.log("..... returning:",nextQuestion);
        return nextQuestion;
      },
      //return the next question (object)
      next: function(config){
        console.log("DecisionTree"," next:", config);
        var question = {views:0};
        if( !this.currentQuestion ){//0 case. first question.
          //console.log("...first question");
          this.setCurrentModuleId( this.GRF.getNextModuleId() );
          var firstModuleQuestion = this.GRF.getFirstQuestionInModule(this.currentModuleId);
          _.extend(question, firstModuleQuestion, {first:true});
          //console.log("......",question);
        }else{//find next question within current module
          //console.log("...this.currentQuestion:",this.currentQuestion);
          var nextModuleId    = this.GRF.getNextModuleId( this.currentModuleId ),
              nextQuestionObj  = this.getNextQuestionId( this.currentQuestion, config );
          //console.log("...nextModuleId:",nextModuleId," nextQuestionObj:",nextQuestionObj);
          if(nextQuestionObj.id){//use next question in this module
            //console.log("...currentQuestion is followed by another question in same module");
            var graphNextQuestion = this.getNextQuestionFromGraph(nextQuestionObj);
            _.extend(question, nextQuestionObj, graphNextQuestion);
          }else if(nextModuleId && nextModuleId !== 'module_final'){//jump to next module
            //console.log("...go to next module");
            this.setCurrentModuleId( nextModuleId );
            var firstModuleQuestion = this.GRF.getFirstQuestionInModule(nextModuleId);
            _.extend(question, firstModuleQuestion);
          }else{//account for last module.
            //currently there is not much difference between this and previous, non-final condition.
            //console.log("...graph complete");
            this.setCurrentModuleId( nextModuleId );
            var firstModuleQuestion = this.GRF.getFirstQuestionInModule(nextModuleId);
            _.extend(question, firstModuleQuestion);
            this.publish('survey:complete', {});
          }
        }
        //console.log('... question before being extended: ',question);
        if(question){
          _.extend(question, this.QTN.getNodeById(question.id), { module : this.currentModuleId }, config);
          question.views++;
          //console.log('..... question after being extended a second time: ',question);
        }
        this.setCurrentQuestion(question);
        console.log(".........next:", question);
        return question;
      },
      prev: function(){
        //console.log('prev');
        var question  = null,
            len       = this.history.length;
        if( len > 0 ){
          this.setHistory('delete');
          //console.log('...', this.history);
          question = this.QTN.getNodeById( this.history.pop() );
        }
        //keep internal state in sync w/UI change
        //console.log('... ',question);
        question.views++;
        this.setCurrentQuestion(question);//add question back as currentQuesion
        this.setCurrentModuleId( question.module );

        return question;
      },
      setCurrentModuleId: function( mod_id ){
        //console.log("setCurrentModuleId",mod_id);
        this.currentModuleId = mod_id;
        var data = { id:mod_id, title:this.GRF.getModuleTitleById(mod_id) };
        this.publish('module:change',data);
      },
      setCurrentQuestion: function(question){
        //console.log("DecisionTree", "setCurrentQuestion:",question);
        if(question){
          this.setHistory('add', question);//add qid to history stack.
          var prevQuestionId  = (this.currentQuestion) ? this.currentQuestion.id : this.defaultScreen;
          question = _.extend(question, {previous:prevQuestionId});
          var positionData    = this.getQuestionPosition(question);

          console.log("...positionData:",positionData);
          //determine if is second to last and last question.
          if( positionData.total / positionData.current === 1){
            //console.log("......this is the last question");
            _.extend(question, {last:true});
          }
          if( positionData.total - positionData.current === 1){
            //console.log("......this is the penultimate question")
            _.extend(question, {penultimate:true});
          }

          this.currentQuestion = _.extend(question, {position:positionData});
          //console.log("... currentQuestion has been extended with 'previous' property");
          this.QTN.update(this.currentQuestion);//sync questions store

          this.publish('question:change', this.currentQuestion);
        }
      },
      setHistory: function(verb, obj){
        //console.log('setHistory:',verb, obj);
        switch(verb){
          case 'add':
            this.history.push( obj.id );
            break;
          case 'delete':
            this.history = this.history.slice(0, this.history.length - 1);//remove current question.
            break;
        }
        return this.history;
      },
      updateRunningDelta: function(question){
        //console.log("DecisionTree"," updateRunningDelta");
        var pathDelta = this.getPathDelta(question);
        this.runningDelta += pathDelta;
        //console.log("...",this.runningDelta);
      }
    };

    return _Mixin;
  });
