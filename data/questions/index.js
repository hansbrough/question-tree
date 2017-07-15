{
  "feelings_1":{
    "title":"Your kidney health is important. How confident are you in your understanding of your kidney health?",
    "labels":[
      {"title":"Confident", "qid":"45", "subtype":"likert", "level":"agree"},
      {"title":"I'm not sure", "qid":"46", "subtype":"likert", "level":"neutral"},
      {"title":"Worried", "qid":"47", "subtype":"likert", "level":"disagree"}
    ],
    "category":"survey",
    "type":"radio"
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
  "work_1":{
    "title":"Select the one that best applies to you",
    "labels":[
      {"title":"I am employed", "next":"work_2", "qid":"1"},
      {"title":"I am a student", "next":"work_3", "qid":"2"},
      {"title":"I am a full time primary caregiver to young, elderly or ill family members", "next":"work_4", "qid":"3"},
      {"title":"I am retired or unemployed. I am not a primary caregiver to young, elderly or ill family members.", "next":"work_5", "qid":"4"}
    ],
    "category":"survey",
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
  "work_3":{
    "title":"Select all that apply to you",
    "labels":[
      {
        "title":"I want to keep my existing school schedule",
        "modality_score":{"pd":1,"hhd":1,"hd":-1},
        "qid":"9",
        "criterion":"flexible_schedule"
      },
      {
        "title":"I want to avoid missing school due to any health-related issues",
        "modality_score":{"pd":1,"hhd":1,"hd":-1},
        "insight":true,
        "qid":"10",
        "criterion":"less_time_on_health_issues"
      },
      {
        "title":"I need energy and mental focus to do my school work",
        "modality_score":{"pd":1,"hhd":2,"hd":-1},
        "qid":"11",
        "criterion":"more_energy"
      },
      {
        "title":"none of these apply to me",
        "modality_score":{"pd":0,"hhd":0,"hd":0},
        "unique":true,
        "qid":"12"
      }
    ],
    "type":"checkbox"
  },
  "work_4":{
    "title":"Select all that apply to you",
    "labels":[
      {
        "title":"I have a lot of commitments and a busy schedule",
        "modality_score":{"pd":1,"hhd":1,"hd":-1},
        "qid":"13",
        "criterion":"flexible_schedule"
      },
      {
        "title":"If I have a health issue, it will be difficult to find someone to help care for my family",
        "modality_score":{"pd":1,"hhd":1,"hd":-1},
        "insight":true,
        "qid":"14",
        "criterion":"less_time_on_health_issues"
      },
      {
        "title":"I need energy and mental focus to care for my family",
        "modality_score":{"pd":1,"hhd":2,"hd":-1},
        "qid":"15",
        "criterion":"more_energy"
      },
      {
        "title":"none of these apply to me",
        "modality_score":{"pd":0,"hhd":0,"hd":0},
        "unique":true,
        "qid":"16"
      }
    ],
    "type":"checkbox"
  },
  "work_5":{
    "title":"Select all that apply to you",
    "labels":[
      {
        "title":"I have a lot of regularly scheduled commitments and a busy schedule",
        "modality_score":{"pd":1,"hhd":1,"hd":-1},
        "qid":"17",
        "criterion":"flexible_schedule"
      },
      {
        "title":"I want to avoid missing my regular activities due to any health-related issues",
        "modality_score":{"pd":1,"hhd":1,"hd":-1},
        "insight":true,
        "qid":"18",
        "criterion":"fewer_hospitalizations"
      },
      {
        "title":"I want consistent energy and mental focus",
        "modality_score":{"pd":1,"hhd":2,"hd":-1},
        "qid":"19",
        "criterion":"more_energy"
      },
      {
        "title":"none of these apply to me",
        "modality_score":{"pd":0,"hhd":0,"hd":0},
        "unique":true,
        "qid":"20"
      }
    ],
    "type":"checkbox"
  },

  "independence_1":{
    "title":"Select the one that best applies to you",
    "labels":[
      {"title":"I handle most of my daily activities on my own.", "next":"independence_2", "qid":"21"},
      {"title":"I have difficulty with most daily activities.", "next":"independence_3", "qid":"22"}
    ],
    "type":"radio"
  },
  "independence_2":{
    "title":"Select the one that best applies to you",
    "labels":[
      {
        "title":"I live alone",
        "modality_score":{"pd":1,"hhd":0,"hd":0},
        "qid":"23",
        "criterion":"self_treatment"
      },
      {
        "title":"I live alone. Someone comes to help to me as needed.",
        "modality_score":{"pd":1,"hhd":0,"hd":0},
        "qid":"24",
        "criterion":"self_treatment"
      },
      {
        "title":"I live with someone who might be able/willing to help me with treatments",
        "modality_score":{"pd":1,"hhd":1,"hd":0},
        "qid":"25",
        "criterion":"self_treatment"
      },
      {
        "title":"I live with someone, who will not be able/willing to help me with treatments",
        "modality_score":{"pd":1,"hhd":0,"hd":0},
        "qid":"26",
        "criterion":"self_treatment"
      }
    ],
    "type":"radio"
  },
  "independence_3":{
    "title":"Select the one that best applies to you",
    "labels":[
      {
        "title":"I live alone. I have someone I can rely on who comes to help me every day. ",
        "modality_score":{"pd":1,"hhd":0,"hd":1},
        "qid":"27",
        "criterion":"other_does_treatment"
      },
      {
        "title":"I live with someone who I can rely on to help me with everything I need to do.",
        "modality_score":{"pd":1,"hhd":1,"hd":1},
        "qid":"28",
        "criterion":"other_does_treatment"
      },
      {
        "title":"I live with someone or I live alone. I have no one to rely on for help consistently.",
        "modality_score":{"pd":0,"hhd":0,"hd":1},
        "qid":"29",
        "criterion":"other_does_treatment"
      }
    ],
    "type":"radio"
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
  "thoughts_2":{
    "title":"What things worry you about End Stage Renal Disease?",
    "type":"textarea",
    "qid":"43"
  },
  "thoughts_3":{
    "title":"What are your personal goals for the next 6 months?",
    "type":"textarea",
    "qid":"44"
  },
  "survey_results":{
    "type":"summary",
    "qid":"10000"
  }

}
