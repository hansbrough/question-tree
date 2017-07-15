{
  "meta":{
    "graph_id":"1"
  },
  "module_background":{
    "title":"My Background",
    "questions": [
      {"id":"background_1", "next":"background_2"}
    ],
    "next":"module_plantId"
  },
  "module_plantId":{
    "title":"Plant Identification",
    "questions": [
      {"id":"plantId_1", "next":"plantId_4"},
      {"id":"plantId_4", "next":"plantId_5"}
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
