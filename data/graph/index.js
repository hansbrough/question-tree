{
  "meta":{
    "graph_id":"1"
  },
  "module_background":{
    "title":"My Background",
    "questions": [
      {"id":"background_1", "next":"background_2"},
      {"id":"background_2"}
    ],
    "next":"module_plantClassification"
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
      {"id":"plantId_3", "next":"plantId_4"},
      {"id":"plantId_4", "next":"plantId_5"},
      {"id":"plantId_5", "next":"plantId_6"},
      {"id":"plantId_6"}
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
