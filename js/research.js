/* "What the research says" -- balanced summaries of active debates about elementary education in Ontario.
 * Each topic: what Ontario does, the case for it, concerns and open questions, what parents can do, sources.
 * Shown on the Research page and as short panels on the matching subject / grade / school pages ("on").
 * Keep claims tied to the listed sources; update "reviewed" when revising. */
window.RESEARCH = {
  reviewed: "2026-10",
  topics: [
    {
      id: "reading", icon: "📖", on: ["subject:lang", "grade:sk", "grade:g1", "grade:g2"],
      sources: [
        ["Ontario Human Rights Commission, Right to Read inquiry: Curriculum and instruction", "https://www.ohrc.on.ca/en/right-read-inquiry-report/8-curriculum-and-instruction"],
        ["Teachers' perceptions of implementing the Right to Read recommendations (Education Sciences, 2024)", "https://doaj.org/article/f5d7358a700a41f593e108ef234defb9"],
        ["CBC: The Current on teaching reading in Ontario", "https://www.cbc.ca/1.7313187"],
        ["Right to Read inquiry report (overview)", "https://en.wikipedia.org/wiki/Right_to_Read_inquiry_report"]
      ],
      en: {
        title: "Teaching children to read: phonics and the \"science of reading\"",
        summary: "Ontario changed how reading is taught after a human rights inquiry found many children, especially those with dyslexia, weren't being taught to read effectively. The direction is widely supported; the debate now is about how well it's being put into practice.",
        ontario: "The Ontario Human Rights Commission's Right to Read inquiry (2022) made 157 recommendations. It called for direct, systematic teaching of decoding and spelling (often called structured literacy), and found that \"cueing\" methods -- guessing words from pictures or context -- aren't supported by reading science. The 2023 Language curriculum adopted explicit, systematic phonics, and schools now screen early reading skills from Senior Kindergarten to Grade 2.",
        pro: "Decades of research show that systematic phonics helps children learn to decode words, and helps struggling readers most. Early screening means difficulties are spotted in Kindergarten or Grade 1 rather than years later.",
        con: "Teachers report that starting new practices is easier than stopping old ones (like running records or cueing), and that training, materials and time haven't always kept pace. Teachers' federations raised concerns about the speed of the rollout. Some educators worry that a heavy focus on decoding could crowd out vocabulary, background knowledge and comprehension, which matter more as children grow. There isn't yet independent evidence on whether Ontario's results have improved.",
        parents: "Ask how your child's early reading screening went and what support follows if they're behind. Read aloud every day, and talk about what you read -- that builds the vocabulary and knowledge that phonics alone doesn't."
      },
      fr: {
        title: "Apprendre à lire : la phonétique et la « science de la lecture »",
        summary: "L'Ontario a changé l'enseignement de la lecture après qu'une enquête sur les droits de la personne a conclu que de nombreux enfants, surtout ceux ayant une dyslexie, n'apprenaient pas efficacement à lire. L'orientation est largement appuyée; le débat porte maintenant sur sa mise en œuvre.",
        ontario: "L'enquête Le droit de lire de la Commission ontarienne des droits de la personne (2022) a formulé 157 recommandations. Elle a demandé un enseignement direct et systématique du décodage et de l'orthographe (souvent appelé littératie structurée) et a conclu que les méthodes d'« indices » -- deviner les mots à partir des images ou du contexte -- ne sont pas appuyées par la recherche. Le curriculum de langue de 2023 a adopté un enseignement explicite et systématique de la phonétique, et les écoles dépistent maintenant les habiletés en lecture du jardin d'enfants à la 2e année.",
        pro: "Des décennies de recherche montrent que la phonétique systématique aide les enfants à décoder les mots, surtout les lecteurs en difficulté. Le dépistage précoce permet de repérer les difficultés dès la maternelle ou la 1re année plutôt que des années plus tard.",
        con: "Le personnel enseignant rapporte qu'il est plus facile d'adopter de nouvelles pratiques que d'abandonner les anciennes (comme les fiches d'observation ou les indices), et que la formation, le matériel et le temps n'ont pas toujours suivi. Les fédérations d'enseignants se sont inquiétées du rythme du déploiement. Certains craignent qu'une forte insistance sur le décodage nuise au vocabulaire, aux connaissances générales et à la compréhension, qui comptent davantage à mesure que l'enfant grandit. Il n'existe pas encore de données indépendantes montrant si les résultats de l'Ontario se sont améliorés.",
        parents: "Demandez comment s'est passé le dépistage précoce en lecture de votre enfant et quel soutien est prévu s'il a du retard. Lisez à voix haute chaque jour et parlez de vos lectures : cela développe le vocabulaire et les connaissances que la phonétique seule n'apporte pas."
      }
    },
    {
      id: "math", icon: "🔢", on: ["subject:math", "grade:g6"],
      sources: [
        ["Alfieri et al. (2011), Does discovery-based instruction enhance learning? (summary of two meta-analyses)", "https://makemathmoments.com/?p=64391"],
        ["Global News: Ontario math scores and the curriculum debate (2019)", "https://globalnews.ca/news/5824003/ontario-elementary-students-math-scores-eqao-test"],
        ["CBC: EQAO math results (2019)", "https://www.cbc.ca/1.5262440"],
        ["Direct instruction, inquiry and self-efficacy in Grade 6 math (Springer)", "https://link.springer.com/article/10.1007/s42330-021-00181-3"]
      ],
      en: {
        title: "Teaching math: explicit instruction or inquiry?",
        summary: "For years Ontario has argued over \"discovery math\" versus \"back to basics.\" Research suggests the real answer is in between: guided problem-solving with clear teaching, plus fluent recall of facts.",
        ontario: "The 2020 math curriculum emphasizes recalling math facts, adds coding and financial literacy, and keeps problem-solving. It followed years of falling Grade 6 results -- about half of students meeting the standard. The government blamed the earlier inquiry-focused approach; EQAO noted students' basic skills were stronger than their ability to apply them, and the pandemic complicates any comparison.",
        pro: "Large reviews of research find that explicit teaching beats unguided discovery, where children are left to figure things out alone. Knowing math facts by heart frees up thinking for harder problems.",
        con: "The same research finds that well-designed guided inquiry -- where teachers structure the problem and ask students to explain their thinking -- can outperform explicit teaching alone. \"Inquiry\" means very different things in different classrooms, which makes debates hard to settle. Confidence matters too: one study found teaching approaches affect Grade 6 math partly through how capable students feel.",
        parents: "Practise math facts in short, playful bursts (cards, games, car rides), and also ask \"how did you figure that out?\" Ask the teacher how they balance practice with problem-solving."
      },
      fr: {
        title: "Enseigner les mathématiques : enseignement explicite ou démarche d'enquête?",
        summary: "L'Ontario débat depuis des années entre les « mathématiques par la découverte » et le « retour aux bases ». La recherche suggère que la réponse se situe entre les deux : une résolution de problèmes guidée avec un enseignement clair, et une bonne maîtrise des faits numériques.",
        ontario: "Le curriculum de mathématiques de 2020 insiste sur le rappel des faits numériques, ajoute le codage et la littératie financière, et conserve la résolution de problèmes. Il fait suite à des années de baisse des résultats de 6e année -- environ la moitié des élèves atteignant la norme. Le gouvernement a blâmé l'approche axée sur l'enquête; l'OQRE a souligné que les habiletés de base des élèves étaient meilleures que leur capacité à les appliquer, et la pandémie complique toute comparaison.",
        pro: "De vastes synthèses de recherche montrent que l'enseignement explicite surpasse la découverte non guidée, où les enfants doivent tout trouver seuls. Connaître les faits numériques par cœur libère l'esprit pour des problèmes plus difficiles.",
        con: "Les mêmes recherches montrent qu'une démarche d'enquête bien guidée -- où l'enseignant structure le problème et demande aux élèves d'expliquer leur raisonnement -- peut surpasser l'enseignement explicite seul. Le mot « enquête » recouvre des pratiques très différentes d'une classe à l'autre, ce qui rend le débat difficile à trancher. La confiance compte aussi : une étude a montré que les approches pédagogiques influencent les mathématiques en 6e année en partie par le sentiment de compétence des élèves.",
        parents: "Pratiquez les faits numériques par courtes séances ludiques (cartes, jeux, trajets en voiture), et demandez aussi « comment as-tu trouvé? ». Demandez à l'enseignant comment il équilibre la pratique et la résolution de problèmes."
      }
    },
    {
      id: "kinder", icon: "🧸", on: ["grade:jk", "grade:sk"],
      sources: [
        ["Queen's University: Ontario kindergarten -- what changed, what didn't and why it matters", "https://www.queensu.ca/gazette/stories/ontario-kindergarten-what-changed-what-didn-t-and-why-it-matters"],
        ["Pelletier & Corter (2019), full-day kindergarten outcomes, Journal of Educational Research", "https://ideas.repec.org/a/taf/vjerxx/v112y2019i2p192-210.html"],
        ["University of Toronto: Children gain learning boost from two-year, full-day kindergarten", "https://www.utoronto.ca/news/children-gain-learning-boost-two-year-full-day-kindergarten"],
        ["CP24: Experts weigh in on the new Ontario kindergarten curriculum", "https://www.cp24.com/news/experts-weigh-in-on-the-new-ontario-kindergarten-curriculum-1.6740701"]
      ],
      en: {
        title: "Kindergarten: learning through play, or more academics?",
        summary: "Ontario's full-day Kindergarten is built on play-based learning. The 2026 revision adds more explicit early reading and math. Experts disagree on how far that shift should go.",
        ontario: "Full-day Kindergarten has been play- and inquiry-based since it began. The revised program (in effect from September 2026) keeps play and the whole-child approach but adds explicit literacy expectations based on reading research, a more formal tiered support model and new areas such as coding. The government delayed the rollout by a year to give educators time and training.",
        pro: "A study following Ontario children from Kindergarten to Grade 2 found that two years of full-day Kindergarten led to lasting gains in self-regulation, reading, writing and number knowledge, and these children were more likely to meet the Grade 3 reading standard. Supporters of the revision say explicit early phonics is well supported by research and catches reading difficulties sooner.",
        con: "Some experts worry a \"back to basics\" push could squeeze out the play and inquiry that build self-regulation, language and curiosity. Some early-learning gains may fade if Grade 1 classrooms switch abruptly to desk-based learning. The teachers' federation asked for more training and preparation time before the change.",
        parents: "Ask how play and explicit teaching are balanced in your child's class. At home, both matter: read together, sing and rhyme, and give lots of time for open-ended play."
      },
      fr: {
        title: "La maternelle : apprendre par le jeu, ou plus d'apprentissages scolaires?",
        summary: "La maternelle à temps plein de l'Ontario repose sur l'apprentissage par le jeu. La révision de 2026 ajoute un enseignement plus explicite de la lecture et des mathématiques. Les experts ne s'entendent pas sur l'ampleur souhaitable de ce virage.",
        ontario: "La maternelle à temps plein repose depuis ses débuts sur le jeu et l'enquête. Le programme révisé (en vigueur depuis septembre 2026) conserve le jeu et l'approche globale de l'enfant, mais ajoute des attentes explicites en littératie fondées sur la recherche, un modèle de soutien par paliers plus formel et de nouveaux domaines comme le codage. Le gouvernement a reporté la mise en œuvre d'un an pour donner du temps et de la formation au personnel.",
        pro: "Une étude ayant suivi des enfants ontariens de la maternelle à la 2e année a montré que deux ans de maternelle à temps plein apportaient des gains durables en autorégulation, lecture, écriture et sens du nombre, et que ces enfants atteignaient plus souvent la norme de lecture de 3e année. Les partisans de la révision soulignent que la phonétique explicite précoce est bien appuyée par la recherche et repère plus tôt les difficultés.",
        con: "Certains experts craignent qu'un « retour aux bases » réduise le jeu et l'enquête qui développent l'autorégulation, le langage et la curiosité. Certains gains peuvent s'estomper si la 1re année passe brusquement à un apprentissage assis à un pupitre. La fédération des enseignants a demandé plus de formation et de préparation avant le changement.",
        parents: "Demandez comment le jeu et l'enseignement explicite sont équilibrés dans la classe de votre enfant. À la maison, les deux comptent : lisez ensemble, chantez, faites des rimes et laissez beaucoup de temps au jeu libre."
      }
    },
    {
      id: "eqao", icon: "📝", on: ["schools", "grade:g3", "grade:g6"],
      sources: [
        ["CBC: Report recommends phasing out Ontario's standardized tests (2018)", "https://amp.cbc.ca/news/canada/ottawa/eqao-test-report-ontario-1.4636822"],
        ["Brock University: Hargreaves, Campbell and Volante discuss EQAO testing (2026)", "https://brocku.ca/brock-news/2026/03/opinion-andy-hargreaves-carol-campbell-and-louis-volante-discuss-eqao-testing/"],
        ["Global News: Ontario appoints advisors to review standardized testing", "https://globalnews.ca/news/11716096/eqao-test-advisors/"],
        ["Ontario English Catholic Teachers' Association: It's past time to re-assess EQAO", "https://www.catholicteachers.ca/News-Events/News/Releases/It-s-Past-Time-to-Re-assess-EQAO"],
        ["Hamilton Spectator: Ontario should keep standardized tests in its schools (2018)", "https://www.pressreader.com/canada/the-hamilton-spectator/20180430/281685435462564"]
      ],
      en: {
        title: "Standardized testing: what is EQAO for?",
        summary: "EQAO gives a common province-wide yardstick, but how it's used -- and whether it narrows teaching -- has been debated for years. The province is reviewing its approach again.",
        ontario: "Every Grade 3 and Grade 6 student writes EQAO's reading, writing and math assessments online in the spring. A government-commissioned review led by Carol Campbell (2018), after consulting more than 5,000 people, recommended phasing out the Grade 3 assessment and overhauling Grade 6; those changes weren't adopted. In 2025-26 the education minister appointed advisors to review standardized testing, including whether EQAO matches what's taught in class, and pledged to make the review public.",
        pro: "Defenders say a common external measure is the only way to see, across the whole province, which groups of students are falling behind and whether changes like the new reading and math curricula are working. Without it, gaps can stay hidden.",
        con: "Teachers' federations and some researchers argue the tests narrow teaching toward tested subjects, add stress, and are misused to rank schools whose results mostly reflect their communities. Some say the money would do more good on smaller classes or support. People for Education has warned against focusing on score targets at the expense of subjects like history and geography.",
        parents: "Treat EQAO as one snapshot -- your child's report card reflects a whole year. When comparing schools, use the context and five-year views on this site rather than a single year's score."
      },
      fr: {
        title: "Les tests normalisés : à quoi sert l'OQRE?",
        summary: "L'OQRE fournit un point de repère commun à toute la province, mais son utilisation -- et la question de savoir s'il restreint l'enseignement -- fait débat depuis des années. La province revoit de nouveau son approche.",
        ontario: "Chaque élève de 3e et de 6e année passe au printemps les évaluations en ligne de lecture, d'écriture et de mathématiques de l'OQRE. Un examen commandé par le gouvernement et dirigé par Carol Campbell (2018), après avoir consulté plus de 5 000 personnes, a recommandé d'éliminer progressivement l'évaluation de 3e année et de remanier celle de 6e; ces changements n'ont pas été adoptés. En 2025-2026, le ministre de l'Éducation a nommé des conseillers pour revoir les tests normalisés, y compris leur correspondance avec ce qui est enseigné, et s'est engagé à rendre l'examen public.",
        pro: "Ses défenseurs affirment qu'une mesure externe commune est le seul moyen de voir, à l'échelle de la province, quels groupes d'élèves prennent du retard et si des changements comme les nouveaux curriculums de lecture et de mathématiques fonctionnent. Sans elle, les écarts peuvent rester invisibles.",
        con: "Les fédérations d'enseignants et certains chercheurs soutiennent que les tests restreignent l'enseignement aux matières évaluées, ajoutent du stress et servent à tort à classer des écoles dont les résultats reflètent surtout leur communauté. Certains estiment que cet argent serait plus utile pour réduire la taille des classes ou offrir du soutien. People for Education met en garde contre la focalisation sur les cibles de résultats au détriment de matières comme l'histoire et la géographie.",
        parents: "Considérez l'OQRE comme un instantané : le bulletin de votre enfant reflète toute l'année. Pour comparer des écoles, utilisez les vues de contexte et sur cinq ans de ce site plutôt que les résultats d'une seule année."
      }
    },
    {
      id: "fi", icon: "🇫🇷", on: ["subject:fsl", "grade:jk", "grade:g3"],
      sources: [
        ["Wise (2011), Access to special education for exceptional students in French Immersion: an equity issue", "https://journals.lib.unb.ca/index.php/CJAL/article/view/19873"],
        ["TDSB staff report: French programs review (June 2019)", "https://tdsbwwwtst.tdsb.on.ca/Portals/0/docs/6_1%20Staff%20Report%20French%20Review%20June%202019.pdf"],
        ["Dalhousie University: French immersion in Canadian schools (2024)", "https://www.dal.ca/news/2024/02/22/canada-french-immersion-schools.html"],
        ["Globe and Mail: French immersion and the divide in schools", "https://www.theglobeandmail.com/canada/article-french-immersion-program-schools-divide"]
      ],
      en: {
        title: "French Immersion: who gets in, and who stays?",
        summary: "French Immersion is popular and effective for learning French, but research shows it doesn't serve all children equally -- especially students with special education needs.",
        ontario: "TDSB offers French Immersion starting in JK (early) or Grade 4 (middle). Placement in the program is guaranteed for eligible on-time applicants, though not at a particular school. TDSB has reviewed equity of access to its French programs several times; its 2019 review recommended inclusive practices in all French programs.",
        pro: "Immersion students become functionally bilingual, and research generally finds their English skills catch up with those of English-program students. Many families value immersion as a free, public route to bilingualism.",
        con: "Students with special education needs are under-represented: one study of TDSB data found about 10% of Immersion students have special education needs, compared with 22% across all TDSB programs. Researchers report that children who struggle are often encouraged to move to the English program to get support, which can make Immersion more selective over time. Teacher shortages and uneven access across neighbourhoods are recurring concerns.",
        parents: "If your child has (or might have) a learning need, ask the school what support is available in Immersion before deciding -- and know that support should be available in either program."
      },
      fr: {
        title: "L'immersion française : qui y entre, et qui y reste?",
        summary: "L'immersion française est populaire et efficace pour apprendre le français, mais la recherche montre qu'elle ne sert pas tous les enfants également -- en particulier les élèves ayant des besoins particuliers.",
        ontario: "Le TDSB offre l'immersion française à partir de la maternelle (précoce) ou de la 4e année (moyenne). Une place dans le programme est garantie aux élèves admissibles qui présentent leur demande à temps, mais pas dans une école précise. Le TDSB a examiné l'équité d'accès à ses programmes de français à plusieurs reprises; son examen de 2019 recommandait des pratiques inclusives dans tous les programmes de français.",
        pro: "Les élèves en immersion deviennent fonctionnellement bilingues, et la recherche montre généralement que leurs compétences en anglais rattrapent celles des élèves du programme anglais. Beaucoup de familles voient l'immersion comme une voie publique et gratuite vers le bilinguisme.",
        con: "Les élèves ayant des besoins particuliers sont sous-représentés : une étude des données du TDSB indique qu'environ 10 % des élèves en immersion ont des besoins particuliers, contre 22 % dans l'ensemble des programmes du TDSB. Des chercheurs rapportent que les enfants en difficulté sont souvent encouragés à passer au programme anglais pour obtenir du soutien, ce qui peut rendre l'immersion plus sélective avec le temps. La pénurie d'enseignants et l'accès inégal selon les quartiers sont des préoccupations récurrentes.",
        parents: "Si votre enfant a (ou pourrait avoir) un besoin d'apprentissage, demandez à l'école quel soutien est offert en immersion avant de décider -- et sachez que ce soutien devrait être offert dans les deux programmes."
      }
    },
    {
      id: "gifted", icon: "🧩", on: ["grade:g3", "grade:g4"],
      sources: [
        ["Global News: TDSB task force on gifted and special education programs (2017)", "https://globalnews.ca/news/3907781/restructuring-toronto-schools-gifted-special-ed-programs/"],
        ["TDSB Special Education Advisory Committee update (January 2018)", "https://www.tdsb.on.ca/Portals/0/Community/Community%20Advisory%20committees/SEAC/DepartmentUpdateJan2018.docx"],
        ["TDSB Universal Screening (Grade 3)", "https://www.tdsb.on.ca/Learning-Equity-and-Well-Being/Special-Education-and-Inclusion/Universal-Screening"],
        ["Ontario Human Rights Commission, Right to Read inquiry: Curriculum and instruction", "https://www.ohrc.on.ca/en/right-read-inquiry-report/8-curriculum-and-instruction"]
      ],
      en: {
        title: "Gifted and special education: separate classes or inclusion?",
        summary: "Should students with very different learning needs be taught in separate full-time classes, or supported in their neighbourhood classroom? TDSB has wrestled with this, with strong views on both sides.",
        ontario: "TDSB screens every Grade 3 student for giftedness (CCAT-7), and identified students may be placed in full-time gifted classes, often at another school. It also runs separate (\"congregated\") classes for some special education needs, alongside support in regular classrooms. In 2017 a TDSB equity task force's draft proposed moving these students into regular classrooms; after strong parent opposition the final report kept the separate classes while exploring more local options, and TDSB confirmed gifted classes would continue.",
        pro: "Supporters of separate classes say some children need a different pace or specialized teaching that's hard to provide in a mixed class of 25. Many families of gifted and special-needs students value these programs highly.",
        con: "The task force found students in lower-income areas often had to leave their community to reach special programs, and that admission criteria may not reflect the full range of children's talents. Inclusion advocates argue most students learn best -- academically and socially -- alongside peers in their local school, with the right support.",
        parents: "If your child is identified, ask about all the options -- a full-time class, support in their home school, or both -- and what each would mean for travel, friendships and challenge."
      },
      fr: {
        title: "Douance et éducation de l'enfance en difficulté : classes distinctes ou inclusion?",
        summary: "Les élèves ayant des besoins d'apprentissage très différents devraient-ils être regroupés dans des classes distinctes à temps plein, ou soutenus dans la classe de leur quartier? Le TDSB s'est penché sur la question, avec des opinions tranchées des deux côtés.",
        ontario: "Le TDSB fait passer à tous les élèves de 3e année un test de dépistage de la douance (CCAT-7), et les élèves identifiés peuvent être placés dans des classes pour élèves doués à temps plein, souvent dans une autre école. Il offre aussi des classes distinctes (« regroupées ») pour certains besoins particuliers, en plus du soutien en classe ordinaire. En 2017, l'ébauche d'un groupe de travail sur l'équité du TDSB proposait d'intégrer ces élèves aux classes ordinaires; après une forte opposition de parents, le rapport final a maintenu les classes distinctes tout en explorant des options plus locales, et le TDSB a confirmé le maintien des classes pour élèves doués.",
        pro: "Les partisans des classes distinctes affirment que certains enfants ont besoin d'un rythme différent ou d'un enseignement spécialisé difficile à offrir dans une classe mixte de 25 élèves. Beaucoup de familles d'élèves doués ou ayant des besoins particuliers tiennent beaucoup à ces programmes.",
        con: "Le groupe de travail a constaté que les élèves des quartiers à faible revenu devaient souvent quitter leur communauté pour accéder aux programmes spécialisés, et que les critères d'admission ne reflètent pas toujours la diversité des talents des enfants. Les défenseurs de l'inclusion soutiennent que la plupart des élèves apprennent mieux -- sur le plan scolaire et social -- avec leurs pairs dans leur école de quartier, avec le bon soutien.",
        parents: "Si votre enfant est identifié, renseignez-vous sur toutes les options -- classe à temps plein, soutien dans son école, ou les deux -- et sur ce que chacune implique pour les déplacements, les amitiés et le niveau de défi."
      }
    },
    {
      id: "everyday", icon: "🎒", on: ["schools", "grade:g4", "grade:g5"],
      sources: [
        ["Harris Cooper (Duke University): research on homework", "https://fds.duke.edu/db/aas/Education/harris.cooper/publications/251496"],
        ["CBC: There are cellphone bans in schools around the world. Do any of them work? (2024)", "https://www.cbc.ca/lite/story/1.7304816"],
        ["Carleton University: Louis-Philippe Beland on smartphone bans in Ontario classes", "https://carleton.ca/economics/2024/associate-professor-louis-philippe-beland-research-on-smartphone-bans-in-ontario-classes-discussed-in-the-toronto-star-and-radio-canada"],
        ["University of Ottawa: Ontario weighs ban on cellphones in schools", "https://www.uottawa.ca/en/news-all/academic-expertise-ontario-weighs-ban-cellphones-schools"],
        ["Ontario class size regulation (O. Reg. 132/12)", "https://www.ontario.ca/laws/regulation/120132"]
      ],
      en: {
        title: "Homework, phones and class size",
        summary: "Three everyday questions parents ask -- and what the evidence actually says.",
        ontario: "Homework policies are set by boards and schools. Ontario restricted cellphone use in classrooms in 2024. Class sizes are capped by regulation: at least 90% of a board's Grade 1-3 classes must have 20 or fewer students (see each school's class sizes on this site).",
        pro: "Homework: in large research reviews, homework is clearly linked to achievement in high school, and helping parents support homework well improves completion in elementary school. Phones: an influential study found test scores rose where phones were banned, most for low-achieving students; experts point to distraction and mental-health benefits. Class size: smaller classes in the early grades are the strongest case for class-size limits.",
        con: "Homework: for elementary students, research finds little or no link between homework and achievement. Phones: a later study found no effect of bans on results, a broad review found little conclusive evidence for blanket bans, and enforcement is hard; bans on their own can feel punitive to students. Class size: benefits beyond the early grades are less clear, and smaller classes are expensive.",
        parents: "In elementary school, short reading time and conversation at home matter more than worksheets. Ask how your school handles phones and screen time, and look at your school's class sizes on its profile."
      },
      fr: {
        title: "Devoirs, cellulaires et taille des classes",
        summary: "Trois questions de tous les jours que se posent les parents -- et ce que disent réellement les données.",
        ontario: "Les politiques sur les devoirs sont établies par les conseils et les écoles. L'Ontario a restreint l'usage des cellulaires en classe en 2024. La taille des classes est plafonnée par règlement : au moins 90 % des classes de la 1re à la 3e année d'un conseil doivent compter 20 élèves ou moins (voir la taille des classes de chaque école sur ce site).",
        pro: "Devoirs : dans de vastes synthèses de recherche, les devoirs sont clairement liés à la réussite au secondaire, et aider les parents à bien soutenir les devoirs améliore leur réalisation au primaire. Cellulaires : une étude influente a montré que les résultats augmentaient là où les cellulaires étaient interdits, surtout chez les élèves plus faibles; des experts soulignent les bienfaits sur l'attention et la santé mentale. Taille des classes : les petites classes dans les premières années constituent l'argument le plus solide en faveur des plafonds.",
        con: "Devoirs : au primaire, la recherche trouve peu ou pas de lien entre les devoirs et la réussite. Cellulaires : une étude ultérieure n'a trouvé aucun effet des interdictions sur les résultats, une vaste synthèse a trouvé peu de preuves concluantes en faveur des interdictions générales, et leur application est difficile; imposées seules, elles peuvent sembler punitives aux élèves. Taille des classes : les bienfaits au-delà des premières années sont moins clairs, et les petites classes coûtent cher.",
        parents: "Au primaire, un peu de lecture et des conversations à la maison comptent davantage que les feuilles d'exercices. Demandez comment votre école gère les cellulaires et le temps d'écran, et consultez la taille des classes de votre école dans son profil."
      }
    }
  ]
};
