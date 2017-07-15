{
  "background_1":{
    "title":"Select the one that best applies to you.",
    "labels":[
      {"title":"I am employed", "qid":"1"},
      {"title":"I am a student", "qid":"2"},
      {"title":"I am retired", "qid":"3"},
      {"title":"I'd rather not say; I just like plants", "qid":"4"}
    ],
    "category":"survey",
    "type":"radio"
  },
  "background_2":{
    "title":"Select all that describe your experience.",
    "labels":[
      {"title":"I enjoy growing plants at home.", "qid":"5"},
      {"title":"I have propagated plants", "qid":"6"},
      {"title":"I have worked as a Landscape Architect or Designer", "qid":"7"},
      {"title":"I have worked in Landscape Construction", "qid":"8"},
      {"title":"I have worked in a plant nursery", "qid":"9"},
      {"title":"I have worked as a plant broker", "qid":"10"},
      {"title":"None of the above", "qid":"11", "unique":true}
    ],
    "category":"survey",
    "type":"checkbox"
  },

  "plantId_1":{
    "title":"What genus does this plant most likely belong to?",
    "media": [
      {"type":"image", "src":"/assets/img/a_barberae_e_200.jpg"}
    ],
    "labels":[
      {"title":"Aloe", "qid":"100", "next":"plantId_2"},
      {"title":"Agave", "qid":"101"},
      {"title":"Haworthia", "qid":"102"},
      {"title":"Gasteria", "qid":"103"},
      {"title":"None of the Above", "qid":"104"}
    ],
    "actual":"100",
    "category":"quiz",
    "type":"radio"
  },
  "plantId_2":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/al_aculeata_a_200.jpg"}
    ],
    "labels":[
      {"title":"Aloe aculeata", "qid":"105", "next":"plantId_3"},
      {"title":"Agave celsii", "qid":"106", "next":"plantId_4"},
      {"title":"Aloe africana", "qid":"107"},
      {"title":"Gasteria baylissiana", "qid":"108"}
    ],
    "actual":"105",
    "category":"quiz",
    "type":"radio"
  },
  "plantId_3":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/a_brevifolia_c_200.jpg"}
    ],
    "labels":[
      {"title":"Aloe arborescens", "qid":"109"},
      {"title":"Aloe vera", "qid":"110"},
      {"title":"Aloe africana", "qid":"111"},
      {"title":"Aloe brevifolia", "qid":"112"},
      {"title":"Aloe aculeata", "qid":"113"}
    ],
    "actual":"112",
    "category":"quiz",
    "type":"radio"
  },
  "plantId_4":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/a_bracteosa_d_200.jpg"}
    ],
    "labels":[
      {"title":"Agave celsii", "qid":"114"},
      {"title":"Aloe vera", "qid":"115"},
      {"title":"Agave bracteosa", "qid":"116", "next":"plantId_6"},
      {"title":"Echeveria agavoides", "qid":"117"},
      {"title":"Dudlyea brittonii", "qid":"118"}
    ],
    "actual":"116",
    "category":"quiz",
    "type":"radio"
  },
  "plantId_5":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/a_bracteosa_h_200.jpg"}
    ],
    "labels":[
      {"title":"Agave celsii", "qid":"114"},
      {"title":"Aloe vera", "qid":"115"},
      {"title":"Agave bracteosa", "qid":"116", "next":"plantId_6"},
      {"title":"Echeveria agavoides", "qid":"117"},
      {"title":"Dudlyea brittonii", "qid":"118"}
    ],
    "actual":"116",
    "category":"quiz",
    "type":"radio",
    "comment":"another chance at agave bracteosa w/a different picture."
  },
  "plantId_6":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/a_bracteosa_frost_200.jpg"}
    ],
    "labels":[
      {"title":"Agave bracteosa 'Calamar'", "qid":"119"},
      {"title":"Aloe vera", "qid":"120"},
      {"title":"Agave bracteosa 'Monterey Frost'", "qid":"121", "next":"plantId_7"},
      {"title":"Echeveria agavoides", "qid":"122"},
      {"title":"Agave bracteosa varigata", "qid":"123"}
    ],
    "actual":"121",
    "category":"quiz",
    "type":"radio"
  },
  "plantId_7":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/a_attenuata_a_200.jpg"}
    ],
    "labels":[
      {"title":"Agave bovicornuta", "qid":"124"},
      {"title":"Agave havardiana", "qid":"125"},
      {"title":"Agave attenuata", "qid":"126"},
      {"title":"Agave lophantha", "qid":"127"},
      {"title":"Agave bracteosa", "qid":"128"}
    ],
    "actual":"126",
    "category":"quiz",
    "type":"radio"
  },

  "work_2":{
    "title":"Select all that apply to you",
    "labels":[
      {
        "title":"I want to keep my existing work schedule",
        "modality_score":{"pd":1,"hhd":1,"hd":-1},
        "qid":"5",
        "criterion":"flexible_schedule"
      },
      {
        "title":"I want to avoid missing work due to any health-related issues",
        "modality_score":{"pd":1,"hhd":1,"hd":-1},
        "qid":"6",
        "criterion":"less_time_on_health_issues"
      },
      {
        "title":"I need energy and mental focus to do my work",
        "modality_score":{"pd":1,"hhd":2,"hd":-1},
        "qid":"7",
        "criterion":"more_energy"
      },
      {
        "title":"none of these apply to me",
        "modality_score":{"pd":0,"hhd":0,"hd":0},
        "insight":true,
        "unique":true,
        "qid":"8"
      }
    ],
    "type":"checkbox"
  },

  "activities_1":{
    "title":"Select all that apply to you",
    "labels":[
      {"title":"I exercise or do physical activity at least 3 times a week.", "qid":"30", "criterion":"more_energy"},
      {"title":"I find it difficult to drive or use public transportation.", "qid":"31", "criterion":"avoid_transportation"},
      {"title":"I travel a few times a year or more.", "qid":"32", "criterion":"ease_of_travel"},
      {"title":"I go swimming or take tub baths regularly.", "qid":"33", "criterion":"swimming_bathing"},
      {"title":"None of these apply to me.", "qid":"34", "unique":true}
    ],
    "type":"checkbox"
  },

  "mind_1":{
    "title":"Select all that apply to you",
    "labels":[
      {
        "title":"It is very important to me be able to eat what I want. I find it difficult to stick with a limited diet.",
        "modality_score":{"pd":0,"hhd":1,"hd":-1},
        "qid":"35",
        "criterion":"flexible_diet"
      },
      {
        "title":"I am terrified of needles and/or the sight of blood.",
        "modality_score":{"pd":1,"hhd":-1,"hd":-1},
        "qid":"36",
        "criterion":"needle_free"
      },
      {
        "title":"I have physical limitations that make it difficult for me to operate common appliances and devices (example: atm, washing machine, cooking appliances)",
        "modality_score":{"pd":-1,"hhd":-1,"hd":1},
        "qid":"37",
        "criterion":"other_does_treatment"
      },
      {
        "title":"I have difficulty learning new things or remembering instructions",
        "modality_score":{"pd":-1,"hhd":-1,"hd":1},
        "qid":"38",
        "criterion":"other_does_treatment"
      },
      {
        "title":"An active sex life is important to me",
        "modality_score":{"pd":1,"hhd":1,"hd":0},
        "qid":"39",
        "criterion":"sex_life"
      },
      {
        "title":"I plan to get pregnant in the next year or two ",
        "modality_score":{"pd":0,"hhd":0,"hd":0},
        "qid":"40",
        "criterion":"have_child"
      },
      {
        "title":"None of these apply to me.",
        "modality_score":{"pd":0,"hhd":1,"hd":1},
        "qid":"41",
        "unique":true
      }
    ],
    "type":"checkbox"
  },
  "thoughts_1":{
    "title":"How well do you understand your treatment options.",
    "type":"textarea",
    "qid":"42"
  },
  "survey_results":{
    "type":"summary",
    "qid":"10000"
  }

}
