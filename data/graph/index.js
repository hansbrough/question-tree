{
  "meta":{
    "graph_id":"1"
  },
  "module_profile":{
    "title":"My Profile",
    "questions": [
      { "id":"profile_1", "next":"profile_2" },
      { "id":"profile_2", "next":"profile_3" },
      { "id":"profile_3" }
    ],
    "next":"module_work"
  },
  "module_work":{
    "title":"My Work / Study",
    "questions": [
      { "id":"work_1", "next":"work_3" },
      { "id":"work_3" }
    ],
    "next":"module_relationships"
  },
  "module_relationships":{
    "title":"My Relationships",
    "questions": [{ "id":"relationships_1" }],
    "next":"module_independence"
  },
  "module_independence":{
    "title":"My Independence",
    "questions": [{ "id":"independence_1" }],
    "next":"module_travel"
  },
  "module_travel":{
    "title":"My Travel",
    "questions": [{ "id":"travel_1" }],
    "next":"module_activities"
  },
  "module_activities":{
    "title":"My Activities / My Time",
    "questions": [
      { "id":"activity_1", "next":"activity_3"},
      { "id":"activity_3", "next":"activity_4"},
      { "id":"activity_4", "next":"activity_5"},
      { "id":"activity_5", "next":"activity_6"},
      { "id":"activity_6"}
    ],
    "next":"module_mind"
  },
  "module_mind":{
    "title":"My Mind and Body",
    "questions": [
      { "id":"mind_1", "next":"mind_2"},
      { "id":"mind_2", "next":"mind_3"},
      { "id":"mind_3", "next":"mind_4"},
      { "id":"mind_4", "next":"mind_5"},
      { "id":"mind_5", "next":"mind_6"},
      { "id":"mind_6"}
    ],
    "next":"module_home"
  },
  "module_home":{
    "title":"My Home",
    "questions": [
      { "id":"home_1", "next":"home_2"},
      { "id":"home_2", "next":"home_3"},
      { "id":"home_3", "next":"home_4"},
      { "id":"home_4", "next":"home_5"},
      { "id":"home_5", "next":"home_6"},
      { "id":"home_6", "next":"home_7"},
      { "id":"home_7"}
    ],
    "next":"module_important"
  },
  "module_important":{
    "title":"What is important to you",
    "questions": [
      { "id":"important_1", "next":"important_2"},
      { "id":"important_2", "next":"important_3"},
      { "id":"important_3", "next":"important_4"},
      { "id":"important_4", "next":"important_5"},
      { "id":"important_5", "next":"important_6"},
      { "id":"important_6", "next":"important_7"},
      { "id":"important_7"}
    ]
  }
}
