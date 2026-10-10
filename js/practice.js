/* Free outside practice resources, by grade and subject. Links are checked by tools/check_links.py.
   TVO Learn: Ontario's public educational broadcaster, one page per curriculum strand/module (English only).
   To turn the whole feature off, set SHOW_PRACTICE = false in js/app.js. */
window.PRACTICE = {
  reviewed: "2026-10",
  tvoBase: "https://tvolearn.com/collections/courses/products/",
  tvoK: "https://tvolearn.com/pages/kindergarten",
  // subject id -> [TVO handle part, title]; "{g}" is the grade number. Social Studies titles change by grade.
  tvo: {
    lang: [["language-phonics", "Phonics", [1]], ["language-identity-and-community", "Identity and Community"], ["language-creativity-and-innovation", "Creativity and Innovation"],
           ["language-world-of-media", "World of Media"], ["language-global-citizenship", "Global Citizenship"], ["language-environmental-sustainability", "Environmental Sustainability"]],
    math: [["mathematics-number", "Number"], ["mathematics-algebra", "Algebra"], ["mathematics-data", "Data"], ["mathematics-spatial-sense", "Spatial Sense"], ["mathematics-financial-literacy", "Financial Literacy"]],
    sci: [["science-and-technology-ontario-focus", "Ontario Focus"], ["science-and-technology-global-focus", "Global Focus"],
          ["science-and-technology-scientific-innovations", "Scientific Innovations"], ["science-and-technology-futures-and-possible-futures", "Futures and Possible Futures"]],
    ss: [["social-studies-heritage-and-identity", { 1: "Our Changing Roles and Responsibilities", 2: "Changing Family and Community Traditions", 3: "Communities in Canada, 1780-1850",
           4: "Early Societies to 1500 CE", 5: "Indigenous Peoples and Europeans before 1713", 6: "Communities in Canada, Past and Present" }],
         ["social-studies-people-and-environment", { 1: "The Local Community", 2: "Global Communities", 3: "Living and Working in Ontario",
           4: "Political and Physical Regions of Canada", 5: "The Role of Government and Responsible Citizenship", 6: "Canada's Interactions with the Global Community" }]],
    hpe: [["health-and-physical-education-active-living", "Active Living"], ["health-and-physical-education-movement-competence", "Movement Competence"], ["health-and-physical-education-healthy-living", "Healthy Living"]],
    arts: [["the-arts-music", "Music"], ["the-arts-visual-arts", "Visual Arts"], ["the-arts-drama", "Drama"], ["the-arts-dance", "Dance"]],
    fsl: [["french-as-a-second-language", "Core French", [4, 5, 6]]]
  },
  eqao: { // Grade 3 and 6 reading/writing/math: official sample test and released questions
    g3: { en: "https://www.eqao.com/the-assessments/primary-division/#sample-test", fr: "https://www.eqao.com/les-tests/cycle-primaire/?lang=fr" },
    g6: { en: "https://www.eqao.com/the-assessments/junior-division/#sample-test", fr: "https://www.eqao.com/les-tests/cycle-moyen/?lang=fr" }
  },
  potw: { en: "https://cemc.uwaterloo.ca/resources/potw", fr: "https://cemc.uwaterloo.ca/fr/resources/potw", grades: { g3: "A", g4: "A", g5: "B", g6: "B" } }
};
