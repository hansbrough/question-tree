// Define an AMD module
// Decision Tree Logic

define(['underscore', 'backbone', 'mixins/Graph'],
  function (_, Backbone, GraphHelpers) {

    //constructor
    var _Mixin = function(options){
      console.log('DecisionTree Constructor');
      options = options || {};
      this.currentModuleId = null;
      this.currentQuestion = null;
      this.currentModuleQuestionIdx = null;
      this.questions  = {};
      this.history    = [];
      this.GRF        = null;

      this.initialize(options);
    };

    _Mixin.prototype = {
      initialize: function(options){
        //console.log("DecisionTree", " initialize:" ,options);
        var graphName = options.graph_name || null,
            questionSetName = options.question_set_name || null;
        this.token = options.token || null;
        this.defaultScreen = options.defaultScreen || 'introduction';
        _.bindAll(this,'setQuestions');

        //intialize Graph
        this.GRF = new GraphHelpers({'graph_name':options.graph_name});

        //make some intial requests for data.
        this.requestQuestions(questionSetName);
      },
      //return question (object) by a given id
      /*
      findModuleIdByQid: function(qid){
        //console.log('FINDMODULEIDBYQID: ',qid, ' in ', this.questions);
        var question, questions, modId;
        for(var i in this.questions){
          questions = this.questions[i].labels || [this.questions[i]];//text questions have no labels array.
          //console.log("...questions:",questions);
          question = this.findQuestionInSetByQid(questions, qid);
          //console.log("...question:",question);
          if( question){
            modId = i;
            break;
          }
        }
        return modId;
      },
      */
      findQuestionInSetByQid: function(set, qid, options){
        //console.log("..FINDQUESTIONINSETBYQID: ",set, qid, options);
        var len = set.length,
            q = null;
        while(len--){
          //console.log('... len:',len);
          if( qid === parseInt(set[len].qid) ){
            if(options){
              //console.log('.... extending set with options: ', options);
              _.extend(set[len], options);
            }
            q = set[len];
            //console.log('.... found match.');
            break;
          }
        }
        return q;
      },
      getCurrentQuestion: function(){
        return this.currentQuestion;
      },
      getDistanceBetweenNodes: function(){
        console.log("getDistanceBetweenNodes");
      },
      /*
      * given a start point node for a conditional path - return the squential path end node
      */
      getSequentialEndPoint: function(question){
        console.log("getSequentialEndPoint:", question);
        //console.log("...previous question:",question.previous);
        //var graphQuestion = this.getQuestionFromGraphById(question.previous);
        var graphQuestion = this.GRF.getQuestionById(question.previous);
        var graphModule   = this.GRF.getModuleByQid(question.previous);
        //console.log("......graphQuestion",graphQuestion);
        //console.log("......graphModule",);
        var orderedModQuestions = graphModule.questions.map(function(a){return a.id});
        var endPtIdx = orderedModQuestions.indexOf(graphQuestion.next);
        //console.log("......endPtIdx:",endPtIdx);
        var conditionalReentryPt = orderedModQuestions.indexOf(question.next);
        //console.log("......conditionalReentryPt:",conditionalReentryPt);
        //console.log("........delta:",endPtIdx - conditionalReentryPt);
      },
      /*
      * for conditional paths return length
      */
      getPathDelta: function(question){
        //console.log("getPathDelta: ",question);
        var delta = 0;
        if(question && question.conditional){
          this.getSequentialEndPoint(question);

        }

        return delta;
      },
      getPathType: function(){
        console.log("DecisionTree"," getPathType");

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
          //payload.module = this.findModuleIdByQuestionSetid(payload.id);
          payload.module = this.GRF.getModuleIdByQuestionSetid(payload.id);
          payload.conditional = true;
        }else if(question.next){
          //console.log("... by graph");
          payload.id = question.next;
          //payload.module = this.findModuleIdByQuestionSetid(payload.id);
          payload.module = this.GRF.getModuleIdByQuestionSetid(payload.id);
        }
        return payload;
      },
      /*
      * determine the total number of *conditional* questions that have been answered.
      * TODO: determine of 'detour' (increment count) or 'shortcut' (decrement from count) path.
      */
      getConditionalQuestionCount: function(newCurrentQuestion){
        //console.log("getConditionalQuestionCount");
        var cnt = 0;
        this.history.forEach( function(modId){
          var question = (modId === newCurrentQuestion.id) ? newCurrentQuestion : this.questions[modId];
          if(question.conditional){
            cnt = cnt+1;
          }
        }, this);
        return cnt;
      },
      getTotalQuestionCount: function(newCurrentQuestion){
        //console.log("DecisionTree"," getTotalQuestionCount");
        //this.getPathDelta(newCurrentQuestion);
        var cnt = this.GRF.getQuestionCount();
        cnt += this.getConditionalQuestionCount(newCurrentQuestion);
        return cnt;
      },
      /*
      * return object with current question index and the total question count.
      * account for conditional questions by setting current idx to items in history.
      */
      getQuestionPosition: function(question){
        //console.log("Survey"," getQuestionPosition: ", question);
        var position    = {current:this.history.length, total:this.getTotalQuestionCount(question)};
        //console.log("...position:",position);
        return position;
      },
      /*
      * return object w/next question id based on the current question.
      * looks up current question in *graph* to determine the next squenced question id.
      */
      getNextQuestionFromGraph: function(){
        console.log("getNextQuestionFromGraph");
        var question      = this.GRF.getNextModuleQuestion(this.currentModuleId, this.currentQuestion.next);
        var nextQuestion  = (question && question.next) ? {next:question.next} : {};
        console.log("..... returning:",nextQuestion);
        return nextQuestion;
      },
      /*
      merge: function(payload){
        //console.log('merge');
        var questions = this.questions,
            modId, question, answer;
        //questions are organized by question set id e.g. 'work_1' and a labels array... we get back a question id
        for(var i=0;i<payload.answers.length;i++){
          answer = payload.answers[i];
          modId = this.findModuleIdByQid(answer.questionId);
          //console.log('...modId:',modId);
          if(modId){
            question = questions[modId].labels || [questions[modId]]; //text questions have no labels array.
            //console.log('... answer:',answer);
            this.updateQuestion(question, answer);
            questions[modId].previouslyAnswered = true;
          }
        }

      },
      */
      //return the next question (object)
      next: function(config){
        //console.log("DecisionTree"," next:", config);
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
            var graphNextQuestion = this.getNextQuestionFromGraph();
            _.extend(question, nextQuestionObj, graphNextQuestion);
          }else if(nextModuleId && nextModuleId !== 'module_final'){//jump to next module
            console.log("...go to next module");
            this.setCurrentModuleId( nextModuleId );
            var firstModuleQuestion = this.GRF.getFirstQuestionInModule(nextModuleId);
            _.extend(question, firstModuleQuestion);
          }else{//account for last module.
            //currently there is not much difference between this and previous, non-final condition.
            //console.log("...graph complete");
            this.setCurrentModuleId( nextModuleId );
            var firstModuleQuestion = this.GRF.getFirstQuestionInModule(nextModuleId);
            _.extend(question, firstModuleQuestion);
            Backbone.trigger('survey:complete', {});
          }
        }
        //console.log('... question before being extended: ',question);
        if(question){
          _.extend(question, this.questions[question.id], { module : this.currentModuleId }, config);
          question.views++;
          //console.log('..... question after being extended a second time: ',question);
        }
        this.setCurrentQuestion(question);
        //console.log("next:", question);
        return question;
      },
      prev: function(){
        //console.log('prev');
        var question  = null,
            len       = this.history.length;
        if( len > 0 ){
          this.setHistory('delete');
          //console.log('...', this.history);
          question = this.questions[ this.history.pop() ];
        }
        //keep internal state in sync w/UI change
        //console.log('... ',question);
        question.views++;
        this.setCurrentQuestion(question);//add question back as currentQuesion
        this.setCurrentModuleId( question.module );

        return question;
      },
      requestQuestions: function(config_name){
        config_name = config_name || 'index.js';
        var token   =  this.token,
            api_url = '/data/questions/'+config_name;
        $.ajax({
              url: api_url,
              type: 'GET',
              xhrFields: {
                withCredentials: true
              },
              dataType: 'json',
              contentType: "application/json; charset=utf-8",
              headers: {
                'Authorization': 'Bearer '+ token
              }
            }).done( this.setQuestions );
      },
      /*
      * get user responses to previously answered questions for current survey
      */
      /*
      requestAnswers: function(){
        //console.log("requestAnswers: ");
        var token     =  this.token,
            surveyId  = this.getId(),
            api_url   = '/survey/answers/'+surveyId;

        if(token){
          $.ajax({
                url: api_url,
                xhrFields: {
                  withCredentials: true
                },
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                headers: {
                  'Authorization': 'Bearer '+ token
                },
                type: 'GET'
              }).done( this.setAnswers );
        }
      },
      */
      /*
      setAnswers: function(resp){
        //console.log("setAnswers: ",resp);
        var previouslyAnswered = resp.data;
        this.answers = previouslyAnswered;
        if(previouslyAnswered.length > 0){
          Backbone.trigger('answers:set', {answers:previouslyAnswered});
        }
      },
      */
      setCurrentModuleId: function( mod_id ){
        //console.log("setCurrentModuleId",mod_id);
        this.currentModuleId = mod_id;
        var data = { id:mod_id, title:this.GRF.getModuleTitleById(mod_id) };
        Backbone.trigger('module:change',data);
      },
      setCurrentQuestion: function(question){
        //console.log('Survey setCurrentQuestion: ',question);
        if(question){
          this.setHistory('add', question);//add qid to history stack.
          var prevQuestionId  = (this.currentQuestion) ? this.currentQuestion.id : this.defaultScreen;
          question = _.extend(question, {previous:prevQuestionId});
          this.getPathDelta(question);
          var positionData    = this.getQuestionPosition(question);

          console.log("...positionData:",positionData);
          //determine if is second to last and last question.
          if( positionData.total / positionData.current === 1){
            _.extend(question, {last:true});
          }
          if( positionData.total - positionData.current === 1){
            _.extend(question, {penultimate:true});
          }

          this.currentQuestion = _.extend(question, {position:positionData});
          console.log("... currentQuestion has been extended with 'previous' property");
          this.updateSet(this.currentQuestion);//sync questions store

          Backbone.trigger('question:change', this.currentQuestion);
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
      setQuestions: function(resp){
        //console.log('setQuestions:',resp);
        this.questions = resp.data || resp || {};
        //console.log("... this: ",this);
      },
      /*
      * Update an individual question (within a set/screen)
      */
      updateQuestion: function(set, answer){
        //console.log("UPDATEQUESTION: ",answer);
        var answerValue = answer.booleanValue || answer.textValue;
        var options = {answerId:answer.surveyAnswerId, answerValue:answerValue};
        //console.log('... options:',options);
        var question = this.findQuestionInSetByQid(set, answer.questionId, options);
        return question;
      },
      //update the question set with changes.
      updateSet: function(question){
      //console.log('updateSet: ', question);
        var _id = question.id;
        this.questions[_id] = question;
      }
    };

    return _Mixin;
  });
