/*
 * Contenu en francais du Guide du curriculum du TDSB (maternelle a la 6e annee).
 * Meme structure que js/data.js. Resume en langage simple -- pas le texte officiel.
 */
window.CURRICULUM_DATA = window.CURRICULUM_DATA || {};
window.CURRICULUM_DATA.fr = {
  lastReviewed: "octobre 2026",

  grades: [
    { id: "jk", short: "Mat.", name: "Maternelle (1re année du programme)", age: "Atteint 4 ans au plus tard le 31 décembre de l'année d'entrée",
      summary: "Une année axée sur le jeu : sentiment d'appartenance, routines, autorégulation, langage et sens du nombre. L'enseignement est assuré par une équipe composée d'une enseignante ou d'un enseignant et d'une éducatrice ou d'un éducateur de la petite enfance inscrit (EPEI).",
      big: ["S'adapter aux routines de l'école", "Se faire des amis et attendre son tour", "Parler, écouter et raconter des histoires", "Compter et remarquer des régularités", "Explorer par le jeu, la construction et l'apprentissage en plein air"],
      ask: ["Comment mon enfant s'adapte-t-il aux routines et à la séparation?", "Avec qui mon enfant joue-t-il et comment gère-t-il les conflits?", "Que remarquez-vous au sujet de son langage et de son sens du nombre?", "Comment puis-je vous faire part de ce que mon enfant fait à la maison?"] },
    { id: "sk", short: "Jardin", name: "Jardin d'enfants (2e année du programme)", age: "Atteint 5 ans au plus tard le 31 décembre de l'année scolaire",
      summary: "La deuxième année du programme de maternelle et jardin d'enfants. Les enfants prennent plus de responsabilités et de leadership, avec une attention accrue à la lecture, à l'écriture et aux mathématiques en vue de la 1re année.",
      big: ["Diriger des routines et aider les plus jeunes", "Correspondance lettre-son et lecture émergente", "Écrire son nom et des mots simples", "Compter, comparer et premières idées d'addition", "Poser des questions et faire des recherches"],
      ask: ["Quelles lettres et quels sons mon enfant maîtrise-t-il?", "Comment se développe son sens du nombre (compter, comparer)?", "Mon enfant est-il prêt pour la concentration plus longue exigée en 1re année?", "Y a-t-il des résultats du dépistage précoce en lecture que je devrais connaître?"] },
    { id: "g1", short: "1re", name: "1re année", age: "Habituellement 6 ans pendant l'année",
      summary: "La première année d'apprentissage par matières et le premier bulletin scolaire de l'Ontario. Grands progrès en lecture et en écriture, nombres jusqu'à 50 et découverte de la communauté.",
      big: ["Décoder et lire des livres simples", "Écrire des phrases", "Nombres jusqu'à 50, faits d'addition jusqu'à 10", "Les êtres vivants et les saisons", "Mes rôles à la maison, à l'école et dans la communauté"],
      ask: ["À quel niveau de lecture mon enfant se situe-t-il et quelle est la prochaine étape?", "Quelles notions de phonétique devrions-nous pratiquer à la maison?", "Comment ses habiletés d'apprentissage (organisation, autonomie) se développent-elles?", "Le dépistage précoce en lecture a-t-il révélé des points à travailler?"] },
    { id: "g2", short: "2e", name: "2e année", age: "Habituellement 7 ans pendant l'année",
      summary: "Développer la fluidité en lecture, écrire des textes plus longs, nombres jusqu'à 200 et rappel rapide des faits d'addition et de soustraction.",
      big: ["Lire avec plus de fluidité et de compréhension", "Écrire de courts paragraphes et des histoires", "Nombres jusqu'à 200; faits d'addition et de soustraction jusqu'à 20", "Animaux, liquides et solides, machines simples", "Traditions familiales et communautés du monde"],
      ask: ["Mon enfant lit-il avec fluidité au niveau de son année?", "Avec quelle rapidité se rappelle-t-il les faits d'addition et de soustraction?", "Quel genre de textes écrit-il et quelle est la prochaine étape?"] },
    { id: "g3", short: "3e", name: "3e année", age: "Habituellement 8 ans pendant l'année",
      summary: "Une année charnière : évaluation de l'OQRE en lecture, écriture et mathématiques au printemps, dépistage universel de la douance du TDSB (CCAT-7) à l'automne, et période de demande pour l'immersion française moyenne.",
      big: ["Lire pour apprendre, et non plus seulement apprendre à lire", "Écrire des textes de plusieurs paragraphes", "Nombres jusqu'à 1 000; introduction à la multiplication", "Plantes, forces, structures et sols", "Les premières communautés au Canada"],
      ask: ["Où se situe mon enfant par rapport à la norme provinciale de 3e année (niveau 3)?", "Comment préparer l'évaluation de l'OQRE sereinement, sans ajouter de stress?", "Qu'a révélé le dépistage CCAT-7 et un suivi est-il recommandé?", "Devrions-nous envisager l'immersion française moyenne pour la 4e année?"] },
    { id: "g4", short: "4e", name: "4e année", age: "Habituellement 9 ans pendant l'année",
      summary: "Le début du cycle moyen. Le français de base commence dans le programme anglais, l'immersion française moyenne débute, et les mathématiques passent aux tables de multiplication et aux nombres décimaux.",
      big: ["Lire des romans et des textes informatifs de façon autonome", "Écriture organisée en plusieurs paragraphes", "Tables de multiplication jusqu'à 10 x 10; dixièmes", "Habitats, lumière et son, roches et érosion", "Sociétés anciennes et régions du Canada", "Début du français de base"],
      ask: ["Mon enfant suit-il le rythme de la charge de travail plus autonome?", "Comment progresse-t-il dans les tables de multiplication?", "Comment mon enfant s'adapte-t-il au français?"] },
    { id: "g5", short: "5e", name: "5e année", age: "Habituellement 10 ans pendant l'année",
      summary: "Plus de recherche et d'écriture autonomes, des nombres plus grands et des décimales, le corps humain, ainsi que le gouvernement et la citoyenneté.",
      big: ["Projets de recherche et textes d'opinion", "Nombres jusqu'à 100 000; centièmes", "Systèmes d'organes du corps humain; propriétés de la matière", "Gouvernement et citoyenneté responsable", "La puberté et la santé personnelle en Santé"],
      ask: ["Comment mon enfant gère-t-il les projets plus longs et les échéances?", "Y a-t-il des lacunes en mathématiques à combler avant l'OQRE de 6e année?", "Que devrions-nous savoir sur le module de santé portant sur la puberté?"] },
    { id: "g6", short: "6e", name: "6e année", age: "Habituellement 11 ans pendant l'année",
      summary: "La dernière année du cycle moyen : évaluation de l'OQRE en lecture, écriture et mathématiques au printemps, et préparation au cycle intermédiaire (7e et 8e), souvent dans une nouvelle école.",
      big: ["Analyser les textes et le point de vue", "Écrire pour différents publics et intentions", "Nombres jusqu'à 1 000 000; fractions, décimales, rapports, nombres entiers", "Biodiversité, électricité, vol et espace", "Les communautés du Canada et son rôle dans le monde"],
      ask: ["Où se situe mon enfant par rapport à la norme provinciale à l'approche de l'OQRE?", "Que devrions-nous savoir sur le passage à la 7e année ou à une école intermédiaire?", "Quelles habiletés d'apprentissage renforcer avant le cycle intermédiaire?"] }
  ],

  kindergartenFrames: [
    { name: "A. Fondements de la langue et des mathématiques", icon: "🔤",
      desc: "Communication orale, lecture et écriture émergentes, sens du nombre, régularités, données, géométrie et mesure. Le programme de 2026 accorde une place plus importante et plus explicite à ce domaine.",
      examples: ["Correspondance lettre-son et phonétique", "Compter, comparer et premières opérations", "Parler de textes et en créer"] },
    { name: "B. Résolution de problèmes et innovation", icon: "💡",
      desc: "Curiosité et enquête : codage, recherche scientifique et processus de design en ingénierie, exploration des milieux naturels et bâtis.",
      examples: ["Poser des questions et vérifier ses idées", "Concevoir, construire et tester des modèles", "Suivre et créer des codes simples"] },
    { name: "C. Autorégulation et bien-être", icon: "🌱",
      desc: "Habiletés sociales, gestion des émotions et de l'attention, notions de santé, participation active et habiletés motrices.",
      examples: ["Se calmer avec du soutien", "Suivre les routines de façon autonome", "Choix sains et jeu actif"] },
    { name: "D. Appartenance et contribution", icon: "🤝",
      desc: "Identité et image de soi, compréhension des perspectives et des communautés, respect de la nature, et réaction aux arts et création artistique.",
      examples: ["Image de soi positive", "Respecter la diversité et s'opposer à l'injustice", "Explorer la danse, l'art dramatique, la musique et les arts visuels"] }
  ],

  subjects: [
    {
      id: "lang", name: "Langue (anglais)", icon: "📚", color: "#3b6fd8",
      doc: "Le curriculum de l'Ontario, de la 1re à la 8e année - Language (2023)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-language",
      strands: ["Liens et applications en littératie", "Fondements de la langue (communication orale, phonétique, orthographe, grammaire, écriture manuscrite)", "Compréhension : comprendre des textes et y réagir", "Rédaction : exprimer ses idées et créer des textes"],
      intro: "Le curriculum de 2023 met l'accent sur l'enseignement explicite et systématique de la phonétique et de la lecture de mots dans les premières années, ainsi que sur la compréhension, l'écriture et la littératie numérique et médiatique. Dans une école anglaise du TDSB, cette matière est enseignée en anglais.",
      threads: [
        { name: "Lecture", values: { jk: "Aime les livres; remarque l'écrit", sk: "Sons des lettres; premiers mots simples", g1: "Décode des mots simples; lit des livres débutants", g2: "Lit avec une fluidité croissante", g3: "Lit des romans à chapitres; lit pour apprendre", g4: "Romans et textes informatifs", g5: "Compare des textes; trouve des preuves", g6: "Analyse le point de vue de l'auteur" } },
        { name: "Écriture", values: { jk: "Traces, dessins, essais de son nom", sk: "Écrit son nom; étiquette; épelle au son", g1: "Phrases simples", g2: "Courtes histoires et paragraphes", g3: "Textes de plusieurs paragraphes", g4: "Textes organisés avec introduction et conclusion", g5: "Textes de recherche et d'opinion", g6: "Écrit pour des publics et des formes variés" } },
        { name: "Étude des mots", values: { jk: "Rimes; entend les sons", sk: "La plupart des correspondances lettre-son", g1: "Voyelles courtes, groupes de consonnes, digrammes", g2: "Voyelles longues; mots fréquents", g3: "Préfixes, suffixes, mots polysyllabiques", g4: "Origine et racines des mots", g5: "Racines grecques et latines; stratégies de vocabulaire", g6: "Morphologie complexe; vocabulaire précis" } }
      ],
      grades: {
        jk: { focus: "Fait partie du domaine A de la maternelle : Fondements de la langue et des mathématiques.",
          learn: ["Écoute des histoires et en parle", "Reconnaît certaines lettres, surtout celles de son nom", "Joue avec les rimes et les sons des mots", "Utilise des dessins et des traces pour communiquer ses idées", "Tient un livre correctement et tourne les pages"],
          home: ["Lisez ensemble chaque jour et parlez des images", "Chantez des chansons et jouez à des jeux de rimes", "Montrez les lettres sur les panneaux et les emballages"] },
        sk: { focus: "Fait partie du domaine A de la maternelle : Fondements de la langue et des mathématiques, avec un accent marqué sur la phonétique.",
          learn: ["Connaît le nom et le son de la plupart des lettres", "Entend le premier, le dernier et le son du milieu dans des mots simples", "Fusionne des sons pour lire des mots simples (c-a-t)", "Écrit son nom et tente d'écrire des mots à l'aide des sons", "Raconte une histoire connue dans l'ordre"],
          home: ["Jouez à « Je vois quelque chose qui commence par /m/ »", "Laissez votre enfant « écrire » la liste d'épicerie ou des cartes", "Après la lecture, demandez : « Qu'est-il arrivé en premier? Ensuite? À la fin? »"] },
        g1: { focus: "Apprendre à lire : décoder des mots et lire des livres simples, et écrire des phrases complètes.",
          learn: ["Décode des mots avec voyelles courtes, groupes de consonnes (st, br) et digrammes (sh, ch, th)", "Lit automatiquement les mots fréquents", "Lit des livres simples avec expression et compréhension", "Écrit des phrases complètes avec majuscules et points", "Raconte un texte et pose des questions à son sujet", "Forme les lettres correctement et lisiblement"],
          home: ["Faites lire à votre enfant des livres décodables chaque jour", "Pratiquez la lecture des mots sur les affiches ou les menus", "Encouragez le journal, les lettres ou la bande dessinée"] },
        g2: { focus: "Développer la fluidité en lecture et écrire des textes plus longs.",
          learn: ["Lit les voyelles longues (ai, ee, oa) et les mots de deux syllabes", "Lit des textes de son niveau avec aisance et précision", "Dégage l'idée principale et les détails importants", "Écrit de courtes histoires et des paragraphes simples", "Utilise des mots descriptifs et des mots de liaison (then, because)", "Utilise la ponctuation simple (points d'interrogation et d'exclamation)"],
          home: ["Relisez les livres préférés pour gagner en fluidité", "Parlez de ce qu'un personnage ressentait et pourquoi", "Demandez à votre enfant d'écrire les règles d'un jeu"] },
        g3: { focus: "Passer d'apprendre à lire à lire pour apprendre. Évaluation de l'OQRE en lecture et en écriture au printemps.",
          learn: ["Lit des romans à chapitres et des textes informatifs de façon autonome", "Résume et fait des inférences", "Utilise les préfixes et suffixes pour lire et orthographier de nouveaux mots", "Écrit des textes organisés de plusieurs paragraphes", "Commence l'écriture cursive", "Révise et corrige ses propres textes"],
          home: ["Laissez votre enfant choisir des livres qu'il aime, y compris des séries et des bandes dessinées", "Demandez « Comment le sais-tu? » pour développer l'inférence", "Écrivez ensemble : courriels à la famille, critiques de films"] },
        g4: { focus: "Lecture autonome de textes plus longs et écriture organisée pour diverses intentions.",
          learn: ["Lit des romans et des textes informatifs avec compréhension", "Compare l'information provenant de plusieurs sources", "Écrit des textes avec une introduction, un développement et une conclusion clairs", "Utilise différents types de phrases", "Comprend comment les médias et les textes numériques cherchent à influencer", "Fait de courtes présentations orales"],
          home: ["Discutez d'actualités ou de publicités : « Qui l'a créée et pourquoi? »", "Visitez la Bibliothèque publique de Toronto ensemble", "Encouragez la lecture avant le coucher"] },
        g5: { focus: "Recherche, textes d'opinion et analyse plus poussée des textes.",
          learn: ["Trouve des preuves dans un texte pour appuyer une opinion", "Utilise les racines grecques et latines pour comprendre le vocabulaire", "Écrit des textes d'opinion et de recherche", "Prend des notes et cite ses sources", "Évalue la fiabilité de l'information en ligne", "Présente de l'information à l'aide d'outils numériques"],
          home: ["Débattez d'un sujet amusant au souper (meilleur animal, meilleure saison)", "Demandez : « Ce site est-il fiable? Comment le sais-tu? »", "Encouragez un bon mélange de fiction et de documentaires"] },
        g6: { focus: "Analyse, point de vue et écriture pour de nombreux publics. Évaluation de l'OQRE en lecture et en écriture au printemps.",
          learn: ["Analyse le point de vue et les partis pris d'un auteur", "Compare les thèmes de plusieurs textes", "Écrit pour divers publics et intentions", "Utilise un vocabulaire précis et des structures de phrases variées", "Révise pour la clarté, le style et l'organisation", "Analyse de façon critique les médias et les textes numériques"],
          home: ["Lisez le même livre et discutez-en comme dans un club de lecture", "Comparez la façon dont différents médias rapportent une même nouvelle", "Encouragez l'écriture pour de vrais publics (lettres, blogues, concours)"] }
      }
    },

    {
      id: "math", name: "Mathématiques", icon: "🔢", color: "#d8573b",
      doc: "Le curriculum de l'Ontario, de la 1re à la 8e année - Mathématiques (2020)",
      url: "https://www.dcp.edu.gov.on.ca/fr/curriculum/elementaire-mathematiques",
      strands: ["Apprentissage socioémotionnel en mathématiques et processus mathématiques", "Nombres", "Algèbre (régularités, équations et codage)", "Données (y compris la probabilité)", "Sens de l'espace (géométrie et mesure)", "Littératie financière"],
      intro: "Le curriculum de mathématiques de 2020 comprend le codage à chaque année, la littératie financière, et met l'accent sur le rappel des faits numériques et la confiance en soi (habiletés socioémotionnelles).",
      threads: [
        { name: "Nombres naturels", values: { jk: "Compte de petits groupes", sk: "Compte jusqu'à 30+; compare", g1: "Jusqu'à 50", g2: "Jusqu'à 200", g3: "Jusqu'à 1 000", g4: "Jusqu'à 10 000", g5: "Jusqu'à 100 000", g6: "Jusqu'à 1 000 000" } },
        { name: "Opérations", values: { jk: "Plus / moins", sk: "Réunit et sépare des groupes", g1: "Faits jusqu'à 10; problèmes jusqu'à 50", g2: "Faits jusqu'à 20; add./soustr. jusqu'à 100", g3: "Add./soustr. jusqu'à 1 000; tables de 2, 5, 10", g4: "Tables jusqu'à 10 x 10; x et / par 1 chiffre", g5: "Tables jusqu'à 12 x 12; 2 chiffres x 2 chiffres", g6: "Décimales et fractions; facteurs premiers" } },
        { name: "Fractions et décimales", values: { jk: "Partage équitable", sk: "Moitiés par le partage", g1: "Demis et quarts par le partage", g2: "Tiers et sixièmes par le partage", g3: "Fractions équivalentes", g4: "Des demis aux dixièmes; dixièmes décimaux", g5: "Jusqu'aux douzièmes; centièmes; rapports", g6: "Millièmes; dénominateurs différents; pourcentages" } },
        { name: "Codage", values: { jk: "Suit et donne des consignes", sk: "Ordonne des étapes", g1: "Code séquentiel", g2: "Événements simultanés", g3: "Boucles répétitives", g4: "Boucles imbriquées", g5: "Instructions conditionnelles", g6: "Code efficace avec conditions" } },
        { name: "Argent", values: { jk: "Jeu de magasin", sk: "Nom des pièces en jouant", g1: "Pièces jusqu'à 50 ¢, billets jusqu'à 50 $", g2: "Montants jusqu'à 200 $", g3: "Rendre la monnaie", g4: "Modes de paiement; épargner ou dépenser", g5: "Budgets, taxe de vente, crédit et dette", g6: "Objectifs financiers; taux d'intérêt" } }
      ],
      grades: {
        jk: { focus: "Fait partie du domaine A de la maternelle : Fondements de la langue et des mathématiques.",
          learn: ["Compte de petites collections en touchant chaque objet une fois", "Reconnaît de petites quantités sans compter (1 à 3)", "Remarque et reproduit des régularités simples", "Trie des objets selon la couleur, la taille ou la forme", "Utilise les mots plus, moins, plus grand, plus petit"],
          home: ["Comptez les marches, les collations et les jouets ensemble", "Créez des régularités avec des perles, des blocs ou des claquements de mains", "Triez la lessive ou l'épicerie"] },
        sk: { focus: "Fait partie du domaine A de la maternelle : Fondements de la langue et des mathématiques, avec un accent accru sur le sens du nombre.",
          learn: ["Compte jusqu'à 30 et plus, et à rebours à partir de 10", "Comprend que le dernier nombre compté indique « combien »", "Compare des groupes et dit lequel en a le plus", "Crée et prolonge des régularités", "Nomme et décrit des figures planes et des solides", "Explore l'addition et la soustraction à l'aide d'histoires"],
          home: ["Jouez à des jeux de société avec des dés", "Demandez « Combien en faut-il de plus? » en mettant la table", "Faites une chasse aux formes dans la maison"] },
        g1: { focus: "Nombres jusqu'à 50, faits d'addition jusqu'à 10, partage équitable et premiers pas en codage.",
          learn: ["Lit, écrit, compte et compare des nombres jusqu'à 50", "Se rappelle les faits d'addition jusqu'à 10 et les faits de soustraction associés", "Résout des problèmes d'addition et de soustraction dont le total ne dépasse pas 50", "Partage équitablement et voit qu'un demi égale deux quarts", "Crée et décrit des régularités", "Écrit et suit un code simple étape par étape", "Reconnaît les pièces canadiennes jusqu'à 50 ¢ et les billets jusqu'à 50 $", "Recueille des données simples et crée des pictogrammes"],
          home: ["Pratiquez différentes façons de faire 10 (7 + 3, 6 + 4)", "Comptez les pièces de la tirelire", "Jouez au « robot » : donnez des consignes étape par étape pour traverser une pièce"] },
        g2: { focus: "Nombres jusqu'à 200 et rappel rapide des faits d'addition et de soustraction jusqu'à 20.",
          learn: ["Compte, compare et ordonne des nombres jusqu'à 200", "Se rappelle les faits d'addition et de soustraction jusqu'à 20", "Additionne et soustrait des nombres dont le total ne dépasse pas 100", "Comprend la multiplication comme des groupes égaux et la division comme un partage", "Partage équitablement et voit qu'un tiers égale deux sixièmes", "Mesure des longueurs en centimètres et en mètres", "Code des événements qui se produisent en même temps", "Représente un même montant d'argent de différentes façons, jusqu'à 200 $"],
          home: ["Faites des jeux de calcul rapide en voiture", "Mesurez des objets dans la maison", "Cuisinez ensemble et parlez de moitiés et de quarts"] },
        g3: { focus: "Nombres jusqu'à 1 000, début de la multiplication et de la division, et codage avec boucles. Évaluation de l'OQRE en mathématiques au printemps.",
          learn: ["Lit, compare et ordonne des nombres jusqu'à 1 000", "Additionne et soustrait des nombres à trois chiffres", "Se rappelle les tables de multiplication de 2, 5 et 10", "Comprend la division comme partage et regroupement", "Représente la multiplication jusqu'à 10 x 10 à l'aide de matrices", "Trouve des fractions équivalentes par le partage équitable", "Écrit du code avec des boucles répétitives", "Calcule la monnaie à rendre lors d'achats simples"],
          home: ["Comptez par bonds de 2, de 5 et de 10", "Demandez : « Si 4 amis partagent 12 biscuits, combien chacun en reçoit-il? »", "Laissez votre enfant compter la monnaie lors des achats"] },
        g4: { focus: "Tables de multiplication jusqu'à 10 x 10, décimales aux dixièmes et boucles imbriquées en codage.",
          learn: ["Lit et compare des nombres jusqu'à 10 000", "Se rappelle les tables de multiplication jusqu'à 10 x 10 et les faits de division associés", "Multiplie et divise des nombres à deux ou trois chiffres par un nombre à un chiffre", "Comprend les fractions jusqu'aux dixièmes et les dixièmes décimaux", "Écrit du code avec des boucles imbriquées", "Trouve l'aire des rectangles et classe les angles", "Explique les notions de dépenser, épargner, gagner, investir et donner"],
          home: ["Pratiquez les tables avec des jeux, des cartes ou des applications", "Lisez et comparez les prix à l'épicerie", "Mesurez une pièce pour en trouver l'aire"] },
        g5: { focus: "Nombres plus grands, tables jusqu'à 12 x 12, décimales aux centièmes, budget et instructions conditionnelles en codage.",
          learn: ["Lit et compare des nombres jusqu'à 100 000", "Se rappelle les tables de multiplication jusqu'à 12 x 12", "Travaille avec des décimales jusqu'aux centièmes et additionne des fractions de même dénominateur", "Multiplie des nombres à deux chiffres par des nombres à deux chiffres", "Divise un nombre à trois chiffres par un nombre à deux chiffres", "Utilise des instructions conditionnelles (si/alors) en codage", "Crée des budgets simples et calcule la taxe de vente", "Mesure des angles avec un rapporteur"],
          home: ["Planifiez ensemble le budget d'une fête ou d'une sortie", "Regardez des statistiques sportives ou météo", "Essayez des sites gratuits de codage par blocs comme Scratch"] },
        g6: { focus: "Nombres jusqu'à un million, fractions, décimales, rapports, pourcentages et nombres entiers. Évaluation de l'OQRE en mathématiques au printemps.",
          learn: ["Lit et compare des nombres jusqu'à 1 000 000 et des décimales aux millièmes", "Comprend les nombres entiers positifs et négatifs", "Travaille avec des rapports, des taux et des pourcentages", "Utilise les règles de divisibilité et les facteurs premiers", "Additionne et soustrait des fractions de dénominateurs différents", "Multiplie et divise avec des décimales et des fractions", "Écrit du code efficace avec des instructions conditionnelles", "Analyse des données et des probabilités", "Trouve l'aire de figures composées et l'aire totale de prismes", "Fixe des objectifs financiers et comprend les taux d'intérêt"],
          home: ["Calculez des rabais et des pourboires (10 %, 25 %)", "Lisez des températures sous zéro", "Comparez les prix unitaires au magasin"] }
      }
    },

    {
      id: "sci", name: "Sciences et technologie", icon: "🔬", color: "#2e9a6b",
      doc: "Le curriculum de l'Ontario, de la 1re à la 8e année - Sciences et technologie (2022)",
      url: "https://www.dcp.edu.gov.on.ca/fr/curriculum/sciences-technologie",
      strands: ["Habiletés en STIM et liens", "Systèmes vivants", "Matière et énergie", "Structures et mécanismes", "Systèmes de la Terre et de l'espace"],
      intro: "Le curriculum de 2022 ajoute un domaine d'habiletés en STIM à chaque année : démarche scientifique, processus de design en ingénierie, codage et liens avec des enjeux du monde réel.",
      threads: [
        { name: "Systèmes vivants", values: { jk: "Observer la nature", sk: "Vivant ou non vivant", g1: "Besoins des êtres vivants", g2: "Croissance et changements chez les animaux", g3: "Croissance et changements chez les plantes", g4: "Habitats et communautés", g5: "Systèmes d'organes humains", g6: "Biodiversité" } },
        { name: "Matière et énergie", values: { jk: "Jeux d'eau et de sable", sk: "Explorer les matériaux", g1: "L'énergie dans notre vie", g2: "Liquides et solides", g3: "Forces qui causent le mouvement", g4: "Lumière et son", g5: "Propriétés et changements de la matière", g6: "Phénomènes électriques" } },
        { name: "Structures et mécanismes", values: { jk: "Construire avec des blocs", sk: "Construire et tester", g1: "Matériaux et structures du quotidien", g2: "Machines simples et mouvement", g3: "Structures solides et stables", g4: "Machines et mécanismes", g5: "Forces agissant sur les structures", g6: "Le vol" } },
        { name: "Terre et espace", values: { jk: "Parler de la météo", sk: "Les saisons", g1: "Changements quotidiens et saisonniers", g2: "L'air et l'eau dans l'environnement", g3: "Les sols dans l'environnement", g4: "Roches, minéraux et érosion", g5: "Conservation de l'énergie et des ressources", g6: "L'espace" } }
      ],
      grades: {
        jk: { focus: "Fait partie du domaine B de la maternelle : Résolution de problèmes et innovation (sciences, ingénierie et codage).",
          learn: ["Pose des questions « pourquoi » et « comment »", "Observe les plantes, les animaux et la météo", "Explore des matériaux comme le sable, l'eau et les blocs", "Décrit ce qu'il remarque à l'aide de ses sens"],
          home: ["Faites des promenades dans un parc ou un ravin du quartier", "Laissez votre enfant arroser les plantes", "Demandez : « Que va-t-il se passer si...? »"] },
        sk: { focus: "Fait partie du domaine B de la maternelle : Résolution de problèmes et innovation, y compris le codage et le design en ingénierie.",
          learn: ["Fait des prédictions et les vérifie", "Construit et améliore des structures", "Remarque les changements de saisons et de météo", "Trie les êtres vivants et non vivants", "Utilise des outils simples comme la loupe"],
          home: ["Construisez avec des matériaux recyclés", "Suivez la météo sur un calendrier", "Plantez des graines et observez-les pousser"] },
        g1: { focus: "Êtres vivants, énergie, matériaux du quotidien et saisons.",
          learn: ["Décrit les besoins des êtres vivants, y compris les humains", "Nomme des sources d'énergie de la vie quotidienne", "Examine les matériaux et la construction des objets du quotidien", "Décrit les changements quotidiens et saisonniers et leurs effets sur les êtres vivants", "Suit un processus de design simple pour construire quelque chose"],
          home: ["Parlez de la façon dont vous utilisez l'énergie à la maison (lumières, cuisinière)", "Remarquez comment les animaux et les gens changent selon les saisons"] },
        g2: { focus: "Animaux, liquides et solides, machines simples, air et eau.",
          learn: ["Décrit comment les animaux grandissent et changent", "Compare les propriétés des liquides et des solides", "Examine des machines simples comme le levier et la roue", "Explique l'importance de l'air et de l'eau et comment les protéger", "Utilise une démarche d'enquête pour répondre à des questions"],
          home: ["Faites geler et fondre des choses ensemble", "Repérez des machines simples au terrain de jeu", "Parlez des façons d'économiser l'eau"] },
        g3: { focus: "Plantes, forces, structures et sols.",
          learn: ["Décrit le cycle de vie des plantes et leur importance pour les humains", "Examine les forces (pousser, tirer, gravité, magnétisme)", "Conçoit et teste des structures solides et stables", "Examine les types de sols et leur importance", "Consigne ses observations et ses résultats"],
          home: ["Faites pousser une plante à partir d'une graine", "Construisez une tour ou un pont avec des spaghettis et des guimauves", "Visitez Allan Gardens ou le Toronto Botanical Garden"] },
        g4: { focus: "Habitats, lumière et son, machines, roches et érosion.",
          learn: ["Décrit les chaînes alimentaires et l'effet des humains sur les habitats", "Examine les propriétés de la lumière et du son", "Construit des dispositifs avec des poulies et des engrenages", "Reconnaît les roches et les minéraux et explique l'érosion", "Mène des expériences contrôlées"],
          home: ["Visitez les galeries des sciences de la Terre du ROM", "Observez l'érosion aux falaises de Scarborough ou dans un ravin", "Fabriquez un téléphone à ficelle"] },
        g5: { focus: "Systèmes d'organes humains, matière, forces sur les structures et conservation de l'énergie.",
          learn: ["Explique comment les principaux systèmes d'organes fonctionnent ensemble", "Décrit les changements physiques et chimiques de la matière", "Analyse les forces qui agissent sur les structures", "Évalue des façons de conserver l'énergie et les ressources", "Utilise un processus de design en ingénierie"],
          home: ["Parlez des saines habitudes et du fonctionnement du corps", "Faites de la chimie en cuisine (bicarbonate de soude et vinaigre)", "Faites ensemble un bilan énergétique de la maison"] },
        g6: { focus: "Biodiversité, électricité, vol et espace.",
          learn: ["Explique la biodiversité et son importance", "Examine l'électricité statique et le courant électrique, et les circuits", "Explique les principes du vol", "Décrit le système solaire et les contributions du Canada à l'exploration spatiale", "Analyse l'incidence de la technologie sur la société et l'environnement"],
          home: ["Participez aux programmes du Centre des sciences de l'Ontario ou visitez un planétarium", "Pliez et testez des avions en papier", "Observez les étoiles hors de la ville"] }
      }
    },

    {
      id: "ss", name: "Études sociales", icon: "🌎", color: "#c08a1e",
      doc: "Le curriculum de l'Ontario - Études sociales, de la 1re à la 6e année; Histoire et géographie, 7e et 8e année (2018, mis à jour en 2023)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-sshg",
      strands: ["A. Patrimoine et identité", "B. Collectivités et environnement"],
      intro: "Chaque année comporte deux domaines, explorés au moyen d'une démarche d'enquête. Les perspectives des Premières Nations, des Métis et des Inuit sont intégrées partout.",
      threads: [
        { name: "Patrimoine et identité", values: { jk: "Moi et ma famille", sk: "La communauté de ma classe", g1: "Nos rôles et responsabilités en évolution", g2: "Traditions familiales et communautaires en évolution", g3: "Les communautés au Canada, 1780-1850", g4: "Les sociétés anciennes jusqu'en 1500", g5: "Peuples autochtones et Européens avant 1713", g6: "Les communautés au Canada, hier et aujourd'hui" } },
        { name: "Collectivités et environnement", values: { jk: "Notre classe", sk: "Notre quartier", g1: "La communauté locale", g2: "Les communautés du monde", g3: "Vivre et travailler en Ontario", g4: "Régions politiques et physiques du Canada", g5: "Rôle du gouvernement et citoyenneté responsable", g6: "Les relations du Canada avec la communauté mondiale" } }
      ],
      grades: {
        jk: { focus: "Fait partie du domaine D de la maternelle : Appartenance et contribution.",
          learn: ["Parle de lui-même et de sa famille", "Montre qu'il est conscient des sentiments des autres", "Participe aux routines et aux tâches de la classe", "Remarque que les gens ont des traditions différentes"],
          home: ["Partagez des photos et des histoires de famille", "Parlez des personnes qui aident dans votre quartier"] },
        sk: { focus: "Fait partie du domaine D de la maternelle : Appartenance et contribution.",
          learn: ["Décrit son rôle dans la communauté de la classe", "Fait preuve de respect envers la diversité", "Reconnaît des lieux de sa communauté", "Contribue aux décisions de groupe"],
          home: ["Promenez-vous dans le quartier et nommez les lieux (bibliothèque, parc, caserne)", "Célébrez des traditions de différentes cultures"] },
        g1: { focus: "Mes rôles et responsabilités, et ma communauté locale.",
          learn: ["Décrit comment les rôles et les relations changent avec le temps", "Explique des façons de respecter les autres", "Nomme des lieux et des services de la communauté locale", "Lit et crée des cartes simples"],
          home: ["Dessinez une carte de votre rue", "Parlez des responsabilités de chacun dans la famille"] },
        g2: { focus: "Les traditions familiales et les communautés du monde.",
          learn: ["Compare les traditions de sa famille et de sa communauté", "Décrit comment les traditions changent avec le temps", "Situe les continents et les océans sur un globe", "Compare les modes de vie dans différentes régions du monde"],
          home: ["Interviewez un grand-parent au sujet des traditions", "Trouvez sur une carte les lieux d'origine des membres de la famille"] },
        g3: { focus: "Les premières communautés au Canada (1780-1850) et vivre et travailler en Ontario.",
          learn: ["Compare la vie des Premières Nations, des colons et des communautés noires au début du Canada", "Décrit les défis auxquels différents groupes ont fait face", "Nomme les régions de l'Ontario et l'utilisation du territoire", "Utilise des cartes, des légendes et l'échelle"],
          home: ["Visitez le Black Creek Pioneer Village ou le Fort York", "Observez l'utilisation du territoire autour de Toronto"] },
        g4: { focus: "Les sociétés anciennes (jusqu'en 1500) et les régions du Canada.",
          learn: ["Compare la vie quotidienne dans des sociétés anciennes du monde", "Décrit comment l'environnement a façonné les sociétés anciennes", "Nomme les provinces, les territoires et leurs capitales", "Décrit les régions physiques du Canada"],
          home: ["Visitez les galeries des cultures du monde du ROM", "Jouez à des jeux de cartes géographiques du Canada"] },
        g5: { focus: "Les interactions entre peuples autochtones et Européens, et le rôle du gouvernement.",
          learn: ["Décrit les interactions entre les peuples autochtones et les Européens avant 1713", "Explique différentes perspectives sur des événements historiques", "Décrit le rôle des gouvernements municipal, provincial et fédéral", "Explique les droits et responsabilités des citoyens", "Examine un enjeu social ou environnemental"],
          home: ["Regardez un extrait du conseil municipal de Toronto ou visitez Queen's Park", "Discutez d'un enjeu local et de qui en est responsable"] },
        g6: { focus: "Les communautés au Canada, hier et aujourd'hui, et le rôle du Canada dans le monde.",
          learn: ["Décrit les contributions de diverses communautés au Canada", "Explique comment l'identité canadienne s'est développée", "Décrit les relations économiques et politiques du Canada avec d'autres pays", "Évalue les réponses à des enjeux mondiaux"],
          home: ["Discutez ensemble de l'actualité internationale", "Explorez l'histoire de votre famille au Canada"] }
      }
    },

    {
      id: "hpe", name: "Éducation physique et santé", icon: "⚽", color: "#9b4fc2",
      doc: "Le curriculum de l'Ontario, de la 1re à la 8e année - Éducation physique et santé (2019)",
      url: "https://www.dcp.edu.gov.on.ca/fr/curriculum/elementaire-education-physique-sante",
      strands: ["Habiletés socioémotionnelles", "Vie active", "Compétence motrice", "Vie saine (alimentation saine, sécurité personnelle, consommation de substances, développement humain et santé sexuelle, santé mentale)"],
      intro: "Les élèves développent des habiletés physiques et de saines habitudes, ainsi que la littératie en santé mentale et la sécurité en ligne. Les parents peuvent demander que leur enfant soit exempté des attentes liées au développement humain et à la santé sexuelle -- communiquez avec la direction d'école.",
      threads: [
        { name: "Mouvement", values: { jk: "Courir, sauter, garder l'équilibre", sk: "Lancer et attraper", g1: "Habiletés motrices de base", g2: "Combiner des mouvements", g3: "Appliquer ses habiletés dans des jeux", g4: "Stratégies dans des jeux simples", g5: "Tactiques dans diverses activités", g6: "Peaufiner habiletés et tactiques" } },
        { name: "Vie saine", values: { jk: "Routines saines", sk: "Règles de sécurité", g1: "Choix alimentaires; parties du corps; sécurité", g2: "Alimentation saine; prendre soin de soi", g3: "Relations saines; origine des aliments", g4: "Intimidation; usage sécuritaire de la technologie", g5: "Puberté; concept de soi", g6: "Changements de la puberté; décisions saines" } }
      ],
      grades: {
        jk: { focus: "Fait partie du domaine C de la maternelle : Autorégulation et bien-être.",
          learn: ["Court, saute, sautille et garde l'équilibre", "Se lave les mains et suit des routines saines", "Nomme ses émotions et demande de l'aide", "Connaît les règles de sécurité de base"],
          home: ["Jouez dehors tous les jours", "Nommez les émotions ensemble (« Tu as l'air frustré »)"] },
        sk: { focus: "Fait partie du domaine C de la maternelle : Autorégulation et bien-être.",
          learn: ["Lance, attrape et botte un ballon", "Utilise des stratégies pour se calmer avec du soutien", "Fait des choix alimentaires sains", "Sait comment rester en sécurité à l'école et dehors"],
          home: ["Pratiquez la respiration profonde ensemble", "Laissez votre enfant préparer une collation santé avec vous"] },
        g1: { focus: "Habiletés motrices de base, choix alimentaires sains et sécurité personnelle.",
          learn: ["Exécute des habiletés de locomotion et de stabilité de base", "Participe à l'activité physique quotidienne", "Reconnaît des choix alimentaires sains", "Nomme les parties du corps avec la terminologie juste", "Connaît les règles de sécurité à la maison et à l'école"],
          home: ["Essayez les programmes récréatifs du TDSB ou de la Ville de Toronto", "Lisez les étiquettes des aliments ensemble"] },
        g2: { focus: "Combiner des mouvements et prendre soin de soi et des autres.",
          learn: ["Combine des habiletés motrices dans des jeux", "Explique les bienfaits de l'activité physique", "Décrit l'alimentation saine et la santé buccodentaire", "Comprend les étapes du développement", "Sait quoi faire en situation dangereuse"],
          home: ["Faites du vélo, de la trottinette ou de la marche ensemble", "Parlez des adultes de confiance"] },
        g3: { focus: "Appliquer ses habiletés dans des jeux, relations saines et choix sécuritaires.",
          learn: ["Applique ses habiletés motrices dans diverses activités", "Décrit les caractéristiques des relations saines", "Explique d'où viennent les aliments", "Sait comment rester en sécurité en ligne"],
          home: ["Établissez des règles familiales sur le temps d'écran et la sécurité en ligne", "Parlez de ce qui fait un bon ami"] },
        g4: { focus: "Stratégies de jeu, prévention de l'intimidation et usage sécuritaire de la technologie.",
          learn: ["Utilise des stratégies simples dans les jeux", "Reconnaît les formes d'intimidation, y compris la cyberintimidation, et sait comment réagir", "Explique un usage sécuritaire et responsable de la technologie", "Fait des choix alimentaires sains"],
          home: ["Discutez de ce qu'il faut faire en cas d'intimidation", "Gardez les appareils dans les pièces communes"] },
        g5: { focus: "Tactiques dans les activités, puberté et concept de soi.",
          learn: ["Applique des tactiques dans diverses activités", "Décrit les changements physiques et émotionnels de la puberté", "Explique les facteurs qui influencent le concept de soi", "Reconnaît les risques liés à la consommation de substances"],
          home: ["Ouvrez la porte aux conversations sur la puberté", "Parlez des médias et de l'image corporelle"] },
        g6: { focus: "Peaufiner ses habiletés, changements de la puberté et prise de décisions saines.",
          learn: ["Peaufine ses habiletés motrices et ses tactiques", "Explique les changements de la puberté et l'hygiène personnelle", "Prend des décisions éclairées pour une vie saine", "Comprend les stéréotypes et les préjugés", "Connaît les ressources de soutien en santé mentale"],
          home: ["Encouragez au moins une activité que votre enfant aime", "Indiquez où trouver de l'aide (Jeunesse, J'écoute : 1-800-668-6868)"] }
      }
    },

    {
      id: "arts", name: "Éducation artistique", icon: "🎨", color: "#d4417f",
      doc: "Le curriculum de l'Ontario, de la 1re à la 8e année - Éducation artistique (2009)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-arts",
      strands: ["Danse", "Art dramatique", "Musique", "Arts visuels"],
      intro: "Chacune des quatre disciplines est enseignée chaque année à l'aide du processus de création (créer) et du processus d'analyse critique (réagir aux œuvres).",
      threads: [
        { name: "Créer", values: { jk: "Exploration libre", sk: "Créations planifiées", g1: "Éléments de base (ligne, pulsation, forme)", g2: "Combiner des éléments", g3: "Exprimer des idées et des émotions", g4: "Utiliser des principes de design", g5: "Communiquer des messages", g6: "Aborder des enjeux par l'art" } },
        { name: "Réagir", values: { jk: "Dit ce qu'il aime", sk: "Décrit une œuvre", g1: "Exprime ses émotions face aux œuvres", g2: "Décrit les choix faits", g3: "Explique des choix artistiques", g4: "Analyse des œuvres de diverses cultures", g5: "Compare des formes artistiques", g6: "Interprète le sens et le contexte" } }
      ],
      grades: {
        jk: { focus: "Fait partie du domaine D de la maternelle : Appartenance et contribution (réagir aux arts et créer).",
          learn: ["Explore la peinture, l'argile et d'autres matériaux", "Chante et bouge au son de la musique", "S'engage dans le jeu symbolique", "Partage ses créations"],
          home: ["Gardez du matériel d'art à portée de main", "Dansez ensemble sur de la musique"] },
        sk: { focus: "Fait partie du domaine D de la maternelle : Appartenance et contribution (réagir aux arts et créer).",
          learn: ["Planifie et crée des œuvres avec intention", "Garde une pulsation régulière", "Joue des histoires", "Parle de ses œuvres et de celles des autres"],
          home: ["Montez des spectacles de marionnettes", "Visitez l'AGO (gratuit pour les jeunes de moins de 25 ans)"] },
        g1: { focus: "Explorer les éléments de base de chaque discipline.",
          learn: ["Utilise la ligne, la forme et la couleur en arts visuels", "Garde la pulsation et explore le rythme", "Utilise son corps et l'espace en danse", "Joue un rôle en art dramatique"],
          home: ["Faites de la musique avec des objets de la maison"] },
        g2: { focus: "Combiner des éléments pour communiquer des idées.",
          learn: ["Crée des œuvres avec texture et motifs", "Chante et joue des rythmes simples", "Crée de courtes séquences de danse", "Utilise la voix et le mouvement en art dramatique"],
          home: ["Assistez à un spectacle familial (le Harbourfront Centre offre des événements gratuits)"] },
        g3: { focus: "Exprimer des idées et des émotions et expliquer ses choix.",
          learn: ["Exprime des émotions par l'art", "Lit une notation musicale simple", "Crée des phrases de danse", "Développe des personnages en art dramatique"],
          home: ["Demandez « Qu'est-ce que tu voulais faire ressentir? » au sujet de son œuvre"] },
        g4: { focus: "Utiliser des principes de design et découvrir l'art de nombreuses cultures.",
          learn: ["Applique des principes comme le contraste et l'accentuation", "Joue de la flûte à bec ou d'autres instruments", "Analyse des œuvres de différentes cultures", "Utilise l'art dramatique pour explorer des enjeux"],
          home: ["Observez ensemble l'art public de Toronto"] },
        g5: { focus: "Communiquer des messages par l'art.",
          learn: ["Crée des œuvres qui transmettent un message", "Interprète de la musique avec expression", "Compose des pièces de danse", "Compare des formes et des styles artistiques"],
          home: ["Encouragez un instrument, une chorale ou un cours d'art si votre enfant s'y intéresse"] },
        g6: { focus: "Utiliser les arts pour explorer des enjeux et interpréter le sens des œuvres.",
          learn: ["Crée des œuvres sur des enjeux sociaux ou environnementaux", "Lit et interprète de la musique plus complexe", "Utilise la danse et l'art dramatique pour raconter des histoires", "Interprète le sens et le contexte des œuvres"],
          home: ["Parlez du message d'un vidéoclip ou d'un film"] }
      }
    },

    {
      id: "fsl", name: "Français", icon: "🇫🇷", color: "#2c8fb0",
      doc: "Le curriculum de l'Ontario - Français langue seconde : français de base, français intensif, immersion française, de la 1re à la 8e année (2013)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-fsl",
      strands: ["Écoute", "Expression orale", "Lecture", "Écriture"],
      intro: "Dans le programme anglais du TDSB, le français de base commence en 4e année. Les points d'entrée en immersion française du TDSB sont la maternelle (immersion précoce) et la 4e année (immersion moyenne). L'Ontario exige qu'à la fin de la 8e année, les élèves aient reçu au moins 600 heures d'enseignement en français.",
      threads: [
        { name: "Programme anglais", values: { jk: "--", sk: "--", g1: "--", g2: "--", g3: "--", g4: "Début du français de base", g5: "Français de base", g6: "Français de base" } },
        { name: "Immersion précoce", values: { jk: "Début du programme (en français)", sk: "Immersion", g1: "Immersion", g2: "Immersion", g3: "Immersion", g4: "Immersion", g5: "Immersion", g6: "Immersion" } },
        { name: "Immersion moyenne", values: { jk: "--", sk: "--", g1: "--", g2: "--", g3: "Demande cette année", g4: "Début du programme", g5: "Immersion", g6: "Immersion" } }
      ],
      grades: {
        jk: { focus: "Pas de français dans le programme anglais. En immersion précoce, l'apprentissage se fait surtout en français.",
          learn: [],
          home: ["En immersion : vous n'avez pas besoin de parler français -- lisez à votre enfant dans votre ou vos langues familiales", "Utilisez des chansons et des émissions en français pour l'exposition"] },
        sk: { focus: "Pas de français dans le programme anglais. L'immersion précoce se poursuit.",
          learn: [],
          home: ["Continuez à lire dans votre langue familiale -- de solides compétences dans la première langue se transfèrent au français"] },
        g1: { focus: "Pas de français dans le programme anglais. L'immersion précoce se poursuit.",
          learn: [],
          home: ["Familles en immersion : demandez à l'enseignante ou à l'enseignant des ressources de lecture en français à la bibliothèque"] },
        g2: { focus: "Pas de français dans le programme anglais. L'immersion précoce se poursuit.",
          learn: [],
          home: ["Empruntez des albums en français à la Bibliothèque publique de Toronto"] },
        g3: { focus: "Pas de français dans le programme anglais. Les familles peuvent faire une demande cette année pour l'immersion française moyenne à partir de la 4e année.",
          learn: [],
          home: ["Consultez la page du TDSB sur l'immersion française moyenne pour connaître la période de demande"] },
        g4: { focus: "Le français de base commence dans le programme anglais.",
          learn: ["Comprend du français oral simple dans des contextes familiers", "Utilise des mots et expressions courants (salutations, nombres, couleurs)", "Lit des textes simples avec soutien", "Écrit de courtes phrases à l'aide de modèles"],
          home: ["Étiquetez des objets de la maison en français", "Utilisez des applications gratuites ou des dessins animés en français"] },
        g5: { focus: "Le français de base se poursuit pour développer l'aisance à parler et à comprendre.",
          learn: ["Suit des consignes et de courtes conversations en français", "Pose des questions simples et y répond", "Lit de courts textes et y repère l'information clé", "Écrit de courts paragraphes sur des sujets familiers"],
          home: ["Regardez TFO (télévision francophone gratuite de l'Ontario) ensemble"] },
        g6: { focus: "Le français de base se poursuit avec des textes plus longs et une expression orale plus spontanée.",
          learn: ["Comprend les idées principales du français oral", "Participe à de courtes conversations spontanées", "Lit divers textes courts", "Écrit pour différentes intentions avec une précision croissante", "Découvre les cultures francophones du Canada et du monde"],
          home: ["Organisez un « souper en français » où chacun essaie quelques phrases"] }
      }
    }
  ],

  reportCards: {
    timeline: [
      { when: "Automne (nov.)", k: "Maternelle : Communication du rendement -- Observations initiales", e: "Bulletin de progrès scolaire -- aucune note; indique si l'élève progresse « avec difficulté / bien / très bien », plus les habiletés d'apprentissage" },
      { when: "Hiver (févr.)", k: "Maternelle : Communication du rendement", e: "Bulletin scolaire de l'Ontario, 1re étape -- notes en lettres et habiletés d'apprentissage" },
      { when: "Juin", k: "Maternelle : Communication du rendement", e: "Bulletin scolaire de l'Ontario, 2e étape -- notes finales de l'année" }
    ],
    levels: [
      { level: "4", letters: ["A+", "A", "A-"], pct: "80-100 %", meaning: "Dépasse la norme provinciale. Connaissances approfondies et très grande maîtrise des habiletés.", tone: "l4" },
      { level: "3", letters: ["B+", "B", "B-"], pct: "70-79 %", meaning: "Atteint la norme provinciale. C'est l'objectif visé pour chaque élève.", tone: "l3" },
      { level: "2", letters: ["C+", "C", "C-"], pct: "60-69 %", meaning: "S'approche de la norme. Certaines connaissances et habiletés; prochaines étapes nécessaires.", tone: "l2" },
      { level: "1", letters: ["D+", "D", "D-"], pct: "50-59 %", meaning: "Bien en deçà de la norme. Connaissances et habiletés limitées; soutien supplémentaire recommandé.", tone: "l1" },
      { level: "R", letters: ["R"], pct: "Moins de 50 %", meaning: "N'a pas encore atteint les attentes minimales. Discutez d'un plan de soutien avec l'enseignante ou l'enseignant.", tone: "lr" },
      { level: "I", letters: ["I"], pct: "--", meaning: "Renseignements insuffisants pour attribuer une note (p. ex. nouvel élève ou longue absence).", tone: "lr" }
    ],
    skills: [
      { name: "Utilisation du sens des responsabilités (Responsibility)", desc: "Termine et remet ses travaux à temps, assume la responsabilité de son comportement." },
      { name: "Sens de l'organisation (Organization)", desc: "Planifie et gère son temps et son matériel pour accomplir ses tâches." },
      { name: "Autonomie (Independent Work)", desc: "Suit les consignes et reste concentré avec un minimum de supervision." },
      { name: "Esprit de collaboration (Collaboration)", desc: "Travaille bien avec les autres, partage ses idées et résout les conflits." },
      { name: "Sens de l'initiative (Initiative)", desc: "Recherche de nouveaux apprentissages, fait preuve de curiosité et prend des risques." },
      { name: "Autorégulation (Self-Regulation)", desc: "Se fixe des objectifs, suit ses progrès et persévère face aux difficultés." }
    ],
    skillRatings: [
      { code: "E", name: "Excellent" }, { code: "G", name: "Good / Très bien (T)" }, { code: "S", name: "Satisfaisant" }, { code: "N", name: "Amélioration nécessaire" }
    ],
    boxes: [
      { name: "ESL/ELD", desc: "Cochée si l'enfant apprend l'anglais et que les attentes ont été modifiées ou que des adaptations ont été apportées." },
      { name: "IEP (PEI)", desc: "Cochée si l'enfant a un plan d'enseignement individualisé et que la note reflète des attentes modifiées ou des adaptations." },
      { name: "French", desc: "Cochée si la matière a été enseignée en français (p. ex. en immersion française)." },
      { name: "NA (S.O.)", desc: "Sans objet -- la matière ou le domaine n'a pas été évalué à cette étape." }
    ]
  },

  milestones: [
    { grade: "before", title: "Inscription à la maternelle", text: "Les enfants commencent la maternelle en septembre de l'année où ils atteignent 4 ans. L'inscription à la maternelle du TDSB ouvre habituellement à l'automne ou à l'hiver précédent. Inscrivez votre enfant à votre école de secteur.", tag: "Inscription" },
    { grade: "before", title: "Demande pour l'immersion française précoce", text: "L'immersion française précoce du TDSB commence à la maternelle. Faites votre demande à l'automne (vers novembre) de l'année précédant l'entrée à la maternelle. Une place dans le programme est garantie aux élèves admissibles qui présentent leur demande à temps; une école précise ne l'est pas.", tag: "Français" },
    { grade: "jk", title: "Rentrée et observations initiales", text: "La maternelle commence en douceur. À l'automne, vous recevrez la Communication du rendement : Observations initiales.", tag: "Bulletin" },
    { grade: "sk", title: "Prêt pour la 1re année", text: "Dernière année du programme de maternelle et jardin d'enfants. Accent sur la lecture, l'écriture et le sens du nombre.", tag: "Transition" },
    { grade: "g1", title: "Dépistage précoce en lecture et premières notes", text: "L'Ontario exige un dépistage précoce en lecture (phonétique et lecture de mots) du jardin d'enfants à la 2e année. La 1re année est aussi la première année de notes en lettres sur le bulletin scolaire de l'Ontario.", tag: "Évaluation" },
    { grade: "g3", title: "Dépistage universel de la douance (CCAT-7)", text: "Le TDSB fait passer à tous les élèves de 3e année le test d'aptitudes cognitives canadien (CCAT-7), habituellement à l'automne. Les résultats servent à planifier l'enseignement et peuvent mener à une évaluation plus poussée.", tag: "Évaluation" },
    { grade: "g3", title: "Demande pour l'immersion française moyenne", text: "Les familles du programme anglais peuvent faire une demande en 3e année pour l'immersion française moyenne à partir de la 4e année.", tag: "Français" },
    { grade: "g3", title: "Évaluation du cycle primaire de l'OQRE", text: "Évaluation provinciale en lecture, écriture et mathématiques, faite en ligne au printemps. Les résultats arrivent à l'automne de la 4e année.", tag: "OQRE" },
    { grade: "g4", title: "Début du français de base", text: "Les élèves du programme anglais commencent le français de base.", tag: "Français" },
    { grade: "g5", title: "La puberté en santé", text: "Les sujets liés au développement humain (y compris la puberté) sont abordés. Vous pouvez demander une exemption de ces attentes auprès de la direction d'école.", tag: "Santé" },
    { grade: "g6", title: "Évaluation du cycle moyen de l'OQRE", text: "Évaluation provinciale en lecture, écriture et mathématiques au printemps.", tag: "OQRE" },
    { grade: "g6", title: "Préparer la 7e année", text: "Certaines écoles du TDSB vont de la maternelle à la 5e ou à la 6e année; beaucoup d'élèves changent donc d'école en 7e année. Certains programmes spécialisés ont des périodes de demande en 5e ou 6e année -- renseignez-vous auprès de votre école.", tag: "Transition" }
  ],

  glossary: [
    { term: "Grille d'évaluation du rendement", def: "L'outil qu'utilisent les enseignants pour évaluer quatre compétences : connaissance et compréhension, habiletés de la pensée, communication et mise en application." },
    { term: "CCAT-7", def: "Test d'aptitudes cognitives canadien. Le TDSB l'utilise pour le dépistage de la douance chez tous les élèves de 3e année." },
    { term: "École de secteur", def: "Votre école locale, déterminée par votre adresse. Utilisez l'outil « Find Your School » du TDSB." },
    { term: "Communication du rendement", def: "Le bulletin de la maternelle. Il comprend des commentaires écrits sur les quatre domaines d'apprentissage, sans notes en lettres." },
    { term: "Français de base", def: "Un cours de français quotidien dans le programme anglais, à partir de la 4e année au TDSB." },
    { term: "EPEI (DECE)", def: "Éducatrice ou éducateur de la petite enfance inscrit. Travaille avec l'enseignante ou l'enseignant dans les classes de maternelle." },
    { term: "OQRE (EQAO)", def: "Office de la qualité et de la responsabilité en éducation. Administre les évaluations provinciales de lecture, d'écriture et de mathématiques en 3e et 6e année." },
    { term: "ESL / ELD", def: "English as a Second Language / English Literacy Development. Programmes de soutien pour les élèves qui apprennent l'anglais." },
    { term: "Attentes (générales et spécifiques)", def: "Les attentes générales décrivent les grands objectifs d'apprentissage à la fin d'une année. Les attentes spécifiques les détaillent en habiletés précises." },
    { term: "Domaines de la maternelle", def: "Les quatre domaines du programme de maternelle. Dans le programme de 2026 : A. Fondements de la langue et des mathématiques; B. Résolution de problèmes et innovation; C. Autorégulation et bien-être; D. Appartenance et contribution." },
    { term: "Immersion française", def: "Un programme où la majeure partie de l'enseignement se fait en français. Points d'entrée au TDSB : maternelle (précoce) et 4e année (moyenne)." },
    { term: "PEI (IEP)", def: "Plan d'enseignement individualisé. Document décrivant les adaptations ou les attentes modifiées pour un élève qui en a besoin." },
    { term: "CIPR (IPRC)", def: "Comité d'identification, de placement et de révision. Identifie officiellement un élève comme étant en difficulté ou doué et recommande un placement." },
    { term: "Apprentissage par l'enquête", def: "Apprentissage guidé par les questions et les recherches des élèves, utilisé dans toutes les matières." },
    { term: "Habiletés d'apprentissage et habitudes de travail", def: "Six habiletés évaluées séparément des notes : sens des responsabilités, sens de l'organisation, autonomie, esprit de collaboration, sens de l'initiative et autorégulation." },
    { term: "Niveau 3", def: "La norme provinciale. Correspond aux notes de la catégorie B sur le bulletin." },
    { term: "Apprentissage par le jeu", def: "L'approche de la maternelle où les enfants apprennent par un jeu intentionnel guidé par les éducateurs." },
    { term: "Bulletin scolaire de l'Ontario", def: "Remis en février et en juin, de la 1re à la 8e année." },
    { term: "Bulletin de progrès scolaire", def: "Remis à l'automne, de la 1re à la 8e année. Indique comment l'élève progresse, sans notes." },
    { term: "Apprentissage socioémotionnel", def: "Habiletés comme gérer le stress, établir des relations et développer un concept de soi positif. Font partie des curriculums de mathématiques et de santé." },
    { term: "SST", def: "School Support Team (équipe de soutien de l'école). Se réunit pour discuter des élèves qui pourraient avoir besoin de soutien ou d'une évaluation." },
    { term: "Domaine d'étude", def: "Une grande partie d'une matière (p. ex. « Nombres » en mathématiques, « Systèmes vivants » en sciences)." },
    { term: "Conseiller scolaire (Trustee)", def: "Personne élue qui représente votre quartier au conseil du TDSB." }
  ],

  sources: [
    { name: "Curriculum et ressources (ministère de l'Éducation)", url: "https://www.dcp.edu.gov.on.ca/fr/curriculum" },
    { name: "Toronto District School Board", url: "https://www.tdsb.on.ca" },
    { name: "TDSB : dépistage universel (3e année)", url: "https://www.tdsb.on.ca/Learning-Equity-and-Well-Being/Special-Education-and-Inclusion/Universal-Screening" },
    { name: "OQRE", url: "https://www.eqao.com/fr/" },
    { name: "Faire croître le succès (politique d'évaluation de l'Ontario)", url: "https://www.ontario.ca/fr/page/faire-croitre-le-succes-evaluation-et-communication-du-rendement-des-eleves-frequentant-les-ecoles-de-lontario" }
  ]
};
