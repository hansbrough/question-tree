{
  "meta":{
    "graph_id":"1"
  },
  "module_plantId":{
    "title":"Plant Identification",
    "questions": [
      {"id":"plantId_1", "next":"plantId_4"},
      {"id":"plantId_4","next":"plantId_5"}
    ],
    "next":"module_independence"
  },
  "module_independence":{
    "title":"My Independence",
    "questions": [
      {"id":"independence_1"}
    ],
    "next":"module_work"
  },
  "module_work":{
    "title":"My Responsibilities",
    "questions": [
      {"id":"work_1"}
    ],
    "next":"module_activities"
  },
  "module_activities":{
    "title":"My Activities",
    "questions": [
      {"id":"activities_1"}
    ],
    "next":"module_mind"
  },
  "module_mind":{
    "title":"My Mind & Body",
    "questions": [
      { "id":"mind_1"}
    ],
    "next":"module_final"
  },
  "module_final":{
    "title":"What's Next",
    "questions": [
      { "id":"survey_results"}
    ]
  }
}
