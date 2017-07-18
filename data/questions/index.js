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

  "plantClassification_1":{
    "title":"What genus does this plant most likely belong to?",
    "media": [
      {"type":"image", "src":"/assets/img/a_barberae_e_200.jpg"}
    ],
    "labels":[
      {"title":"Aloe", "qid":"100"},
      {"title":"Agave", "qid":"101"},
      {"title":"Haworthia", "qid":"102"},
      {"title":"Gasteria", "qid":"103"},
      {"title":"None of the Above", "qid":"104"}
    ],
    "actual":"100",
    "category":"quiz",
    "criterion":"aloe",
    "type":"radio"
  },
  "plantId_1":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/al_aculeata_a_200.jpg"}
    ],
    "labels":[
      {"title":"Aloe aculeata", "qid":"105"},
      {"title":"Agave celsii", "qid":"106","next":"plantId_3"},
      {"title":"Aloe africana", "qid":"107"},
      {"title":"Gasteria baylissiana", "qid":"108"}
    ],
    "actual":"105",
    "category":"quiz",
    "criterion":"aloe",
    "type":"radio"
  },
  "plantId_2":{
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
    "criterion":"aloe",
    "type":"radio"
  },
  "plantId_3":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/a_bracteosa_d_200.jpg"}
    ],
    "labels":[
      {"title":"Agave celsii", "qid":"114"},
      {"title":"Aloe vera", "qid":"115"},
      {"title":"Agave bracteosa", "qid":"116", "next":"plantId_5"},
      {"title":"Echeveria agavoides", "qid":"117"},
      {"title":"Dudlyea brittonii", "qid":"118"}
    ],
    "actual":"116",
    "category":"quiz",
    "criterion":"agave",
    "type":"radio"
  },
  "plantId_4":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/a_bracteosa_h_200.jpg"}
    ],
    "labels":[
      {"title":"Agave celsii", "qid":"114"},
      {"title":"Aloe vera", "qid":"115"},
      {"title":"Agave bracteosa", "qid":"116", "next":"plantId_5"},
      {"title":"Echeveria agavoides", "qid":"117"},
      {"title":"Dudlyea brittonii", "qid":"118"}
    ],
    "actual":"116",
    "category":"quiz",
    "criterion":"agave",
    "type":"radio",
    "comment":"another chance at agave bracteosa w/a different picture."
  },
  "plantId_5":{
    "title":"Which of the following is the name of this plant?",
    "media": [
      {"type":"image", "src":"/assets/img/a_bracteosa_frost_200.jpg"}
    ],
    "labels":[
      {"title":"Agave bracteosa 'Calamar'", "qid":"119"},
      {"title":"Aloe vera", "qid":"120"},
      {"title":"Agave bracteosa 'Monterey Frost'", "qid":"121"},
      {"title":"Echeveria agavoides", "qid":"122"},
      {"title":"Agave bracteosa varigata", "qid":"123"}
    ],
    "actual":"121",
    "category":"quiz",
    "criterion":"agave",
    "type":"radio"
  },
  "plantId_6":{
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
    "criterion":"agave",
    "type":"radio"
  },

  "survey_results":{
    "type":"summary",
    "qid":"10000"
  }

}
