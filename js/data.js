/*
 * Curriculum content for the TDSB JK-6 Parent Guide.
 *
 * TDSB teaches the Ontario Ministry of Education curriculum. Everything below is a
 * plain-language SUMMARY written for parents -- not the official wording. Always check
 * the official documents (links in SOURCES) for the exact expectations.
 *
 * To edit content: find the subject, then the grade key (jk, sk, g1 ... g6).
 * Each grade entry has:
 *   focus : one-line summary of the year
 *   learn : what children work on (also used as the "on track" checklist)
 *   home  : simple ways to support learning at home
 */

window.CURRICULUM_DATA = window.CURRICULUM_DATA || {};
window.CURRICULUM_DATA.en = {
  lastReviewed: "October 2026",

  grades: [
    { id: "jk", short: "JK", name: "Junior Kindergarten", age: "Turns 4 by Dec 31 of the year they start",
      summary: "A play-based year focused on belonging, routines, self-regulation, early language and number sense. Taught by a teacher and a Designated Early Childhood Educator (DECE) team.",
      big: ["Settling into school routines", "Making friends and taking turns", "Talking, listening and storytelling", "Counting and noticing patterns", "Exploring through play, building and outdoor learning"],
      ask: ["How is my child settling into routines and separating from me?", "Who does my child play with, and how do they handle conflict?", "What are you noticing about their language and early number sense?", "How can I share what my child does at home with you?"] },
    { id: "sk", short: "SK", name: "Senior Kindergarten", age: "Turns 5 by Dec 31 of the school year",
      summary: "The second year of the two-year Kindergarten program. Children take on more responsibility and leadership, with growing focus on early reading, writing and math ahead of Grade 1.",
      big: ["Leading routines and helping younger classmates", "Letter-sound knowledge and early reading", "Writing their name and simple words", "Counting, comparing and early addition ideas", "Asking questions and investigating"],
      ask: ["Which letters and sounds is my child confident with?", "How is my child doing with early number sense (counting, comparing)?", "Is my child ready for the longer focus expected in Grade 1?", "Are there any early reading screening results I should know about?"] },
    { id: "g1", short: "Gr 1", name: "Grade 1", age: "Usually 6 during the year",
      summary: "The first year of subject-based learning and the first Provincial Report Card. Big growth in reading and writing, numbers to 50, and learning about community.",
      big: ["Decoding and reading simple books", "Writing sentences", "Numbers to 50, addition facts to 10", "Living things and seasons", "My roles at home, school and community"],
      ask: ["What reading level or stage is my child at, and what's the next step?", "Which phonics skills should we practise at home?", "How are their learning skills (organization, independence) developing?", "Did the early reading screening show anything we should work on?"] },
    { id: "g2", short: "Gr 2", name: "Grade 2", age: "Usually 7 during the year",
      summary: "Building reading fluency, longer writing, numbers to 200 and early fluency with addition and subtraction facts.",
      big: ["Reading more fluently and for meaning", "Writing short paragraphs and stories", "Numbers to 200; add/subtract facts to 20", "Animals, liquids and solids, simple machines", "Family traditions and global communities"],
      ask: ["Is my child reading fluently at grade level?", "How quickly does my child recall addition and subtraction facts?", "What kind of writing are they doing, and what's their next step?"] },
    { id: "g3", short: "Gr 3", name: "Grade 3", age: "Usually 8 during the year",
      summary: "A milestone year: EQAO reading, writing and math assessment in the spring, TDSB's universal gifted screening (CCAT-7) in the fall, and the Middle French Immersion application window.",
      big: ["Reading to learn, not just learning to read", "Multi-paragraph writing", "Numbers to 1,000; intro to multiplication", "Plants, forces, structures and soils", "Early settler and Indigenous communities in Canada"],
      ask: ["How is my child doing compared to the Grade 3 provincial standard (Level 3)?", "How can we prepare calmly for EQAO without adding stress?", "What did the CCAT-7 screening show, and are any follow-ups recommended?", "Should we consider Middle French Immersion for Grade 4?"] },
    { id: "g4", short: "Gr 4", name: "Grade 4", age: "Usually 9 during the year",
      summary: "The start of the junior grades. Core French begins in the English program, Middle French Immersion starts, and math moves into multiplication facts and decimals.",
      big: ["Reading novels and information texts independently", "Organized, multi-paragraph writing", "Multiplication facts to 10 x 10; decimals to tenths", "Habitats, light and sound, rocks and erosion", "Early societies and regions of Canada", "Core French begins"],
      ask: ["Is my child keeping up with the bigger independent workload?", "How are multiplication facts coming along?", "How is my child adjusting to French?"] },
    { id: "g5", short: "Gr 5", name: "Grade 5", age: "Usually 10 during the year",
      summary: "More independent research and writing, larger numbers and decimals, the human body, and government and citizenship.",
      big: ["Research projects and persuasive writing", "Numbers to 100,000; decimals to hundredths", "Human organ systems; properties of matter", "Government and responsible citizenship", "Puberty and personal health in Health"],
      ask: ["How is my child handling longer projects and deadlines?", "Are there gaps in math we should address before Grade 6 EQAO?", "What should we know about the Health unit on puberty?"] },
    { id: "g6", short: "Gr 6", name: "Grade 6", age: "Usually 11 during the year",
      summary: "The last year of the junior division: EQAO reading, writing and math in the spring, and preparing for intermediate grades (7-8), often in a new school.",
      big: ["Analysing texts and point of view", "Writing for different audiences and purposes", "Numbers to 1,000,000; fractions, decimals, ratios, integers", "Biodiversity, electricity, flight and space", "Canada's communities and role in the world"],
      ask: ["How does my child compare to the provincial standard heading into EQAO?", "What should we know about the move to Grade 7 or a middle school?", "Which learning skills should we strengthen before intermediate grades?"] }
  ],

  kindergartenFrames: [
    { name: "A. Foundations of Language and Mathematics", icon: "🔤",
      desc: "Oral language, early reading and writing, number sense, patterns, data, geometry and measurement. The 2026 program gives this area a stronger, more explicit focus.",
      examples: ["Letter-sound knowledge and early phonics", "Counting, comparing and early operations", "Talking about and creating texts"] },
    { name: "B. Problem Solving and Innovating", icon: "💡",
      desc: "Curiosity and inquiry: coding, scientific investigation and engineering design, and exploring natural and built environments.",
      examples: ["Asking questions and testing ideas", "Designing, building and testing models", "Following and creating simple codes"] },
    { name: "C. Self-Regulation and Well-Being", icon: "🌱",
      desc: "Social skills, managing feelings and attention, health concepts, active participation and movement skills.",
      examples: ["Calming down with support", "Following routines independently", "Healthy choices and active play"] },
    { name: "D. Belonging and Contributing", icon: "🤝",
      desc: "Identity and self-image, understanding perspectives and communities, caring for nature, and responding to and creating art.",
      examples: ["Positive sense of self", "Respecting diversity and standing up against unfairness", "Exploring dance, drama, music and visual arts"] }
  ],

  subjects: [
    /* ------------------------------------------------------------------ LANGUAGE */
    {
      id: "lang", name: "Language", icon: "📚", color: "#3b6fd8",
      doc: "Ontario Language curriculum, Grades 1-8 (2023)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-language",
      strands: ["Literacy Connections and Applications", "Foundations of Language (oral language, phonics, spelling, grammar, handwriting)", "Comprehension: Understanding and Responding to Texts", "Composition: Expressing Ideas and Creating Texts"],
      intro: "The 2023 curriculum puts strong emphasis on explicit, systematic teaching of phonics and word-reading skills in the early grades, alongside comprehension, writing and digital/media literacy.",
      threads: [
        { name: "Reading", values: { jk: "Enjoys books; notices print", sk: "Letter sounds; first simple words", g1: "Decodes simple words; reads early books", g2: "Reads with growing fluency", g3: "Reads chapter books; reads to learn", g4: "Novels and information texts", g5: "Compares texts; finds evidence", g6: "Analyses author's point of view" } },
        { name: "Writing", values: { jk: "Marks, drawings, name attempts", sk: "Writes name; labels; sounds out words", g1: "Simple sentences", g2: "Short stories and paragraphs", g3: "Multi-paragraph pieces", g4: "Organized pieces with intro & conclusion", g5: "Research and persuasive writing", g6: "Writes for varied audiences & forms" } },
        { name: "Word skills", values: { jk: "Rhymes; hears sounds", sk: "Most letter-sound pairs", g1: "Short vowels, blends, digraphs", g2: "Long vowel patterns; high-frequency words", g3: "Prefixes, suffixes, multisyllable words", g4: "Word origins & roots", g5: "Greek/Latin roots; vocabulary strategies", g6: "Complex morphology; precise vocabulary" } }
      ],
      grades: {
        jk: { focus: "Part of Kindergarten strand A: Foundations of Language and Mathematics.",
          learn: ["Listens to and talks about stories", "Recognizes some letters, especially in their own name", "Plays with rhyming and sounds in words", "Uses drawings and marks to share ideas", "Holds a book correctly and turns pages"],
          home: ["Read aloud together every day and talk about the pictures", "Sing songs and play rhyming games", "Point out letters on signs and packaging"] },
        sk: { focus: "Part of Kindergarten strand A: Foundations of Language and Mathematics, with a strong focus on early phonics.",
          learn: ["Knows most letter names and their sounds", "Hears the first, middle and last sounds in simple words", "Blends sounds to read simple words (c-a-t)", "Writes their name and attempts words using letter sounds", "Retells a familiar story in order"],
          home: ["Play 'I spy something that starts with /m/'", "Let your child 'write' shopping lists and cards", "Ask 'What happened first? Next? At the end?' after reading"] },
        g1: { focus: "Learning to read: decoding words and reading simple books, plus writing complete sentences.",
          learn: ["Decodes words with short vowels, blends (st, br) and digraphs (sh, ch, th)", "Reads common high-frequency words automatically", "Reads simple books with expression and understanding", "Writes complete sentences with capitals and periods", "Retells and asks questions about texts", "Prints letters legibly with correct formation"],
          home: ["Have your child read decodable books to you daily", "Practise sounding out words when reading signs or menus", "Encourage journals, letters or comics"] },
        g2: { focus: "Building reading fluency and writing longer pieces.",
          learn: ["Reads long-vowel patterns (ai, ee, oa) and two-syllable words", "Reads grade-level text smoothly and accurately", "Identifies main idea and key details", "Writes short stories and simple paragraphs", "Uses describing words and linking words (then, because)", "Uses simple punctuation (question marks, exclamation marks)"],
          home: ["Re-read favourite books to build fluency", "Talk about what a character felt and why", "Ask your child to write instructions for a game"] },
        g3: { focus: "Shifting from learning to read to reading to learn. EQAO reading and writing in spring.",
          learn: ["Reads chapter books and information texts independently", "Summarizes and makes inferences", "Uses prefixes and suffixes to read and spell new words", "Writes organized multi-paragraph pieces", "Begins cursive writing", "Revises and edits own writing"],
          home: ["Let your child choose books they love, including series and graphic novels", "Ask 'How do you know?' to build inference", "Write together: emails to family, reviews of movies"] },
        g4: { focus: "Independent reading of longer texts and organized writing for different purposes.",
          learn: ["Reads novels and non-fiction with comprehension", "Compares information from more than one source", "Writes pieces with a clear introduction, body and conclusion", "Uses a range of sentence types", "Understands how media and digital texts try to influence", "Gives short oral presentations"],
          home: ["Discuss news stories or ads: 'Who made this and why?'", "Visit the Toronto Public Library together", "Encourage reading before bed"] },
        g5: { focus: "Research, persuasive writing and deeper analysis of texts.",
          learn: ["Locates evidence in a text to support opinions", "Uses Greek and Latin roots to understand vocabulary", "Writes persuasive and research-based pieces", "Takes notes and cites sources", "Evaluates reliability of online information", "Presents information using digital tools"],
          home: ["Debate a fun topic at dinner (best pet, best season)", "Ask 'Is this website trustworthy? How can you tell?'", "Encourage a wide mix of fiction and non-fiction"] },
        g6: { focus: "Analysis, point of view and writing for many audiences. EQAO reading and writing in spring.",
          learn: ["Analyses an author's point of view and bias", "Compares themes across texts", "Writes for a range of audiences and purposes", "Uses precise vocabulary and varied sentence structure", "Revises for clarity, voice and organization", "Critically analyses media and digital texts"],
          home: ["Read the same book and discuss it like a book club", "Talk about how different news outlets report the same story", "Encourage writing for real audiences (letters, blogs, contests)"] }
      }
    },

    /* --------------------------------------------------------------- MATHEMATICS */
    {
      id: "math", name: "Mathematics", icon: "🔢", color: "#d8573b",
      doc: "Ontario Mathematics curriculum, Grades 1-8 (2020)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics",
      strands: ["Social-Emotional Learning Skills and Mathematical Processes", "Number", "Algebra (patterns, equations and coding)", "Data (including probability)", "Spatial Sense (geometry and measurement)", "Financial Literacy"],
      intro: "The 2020 math curriculum includes coding in every grade, financial literacy, and a focus on recalling math facts and building confidence (social-emotional learning skills).",
      threads: [
        { name: "Whole numbers", values: { jk: "Counts small groups", sk: "Counts to 30+; compares", g1: "To 50", g2: "To 200", g3: "To 1,000", g4: "To 10,000", g5: "To 100,000", g6: "To 1,000,000" } },
        { name: "Operations", values: { jk: "More / less", sk: "Joins & separates groups", g1: "Facts to 10; problems to 50", g2: "Facts to 20; add/sub to 100", g3: "Add/sub to 1,000; x facts for 2, 5, 10", g4: "x facts to 10 x 10; x and / by 1 digit", g5: "x facts to 12 x 12; 2-digit x 2-digit", g6: "Decimals & fractions; prime factors" } },
        { name: "Fractions & decimals", values: { jk: "Sharing fairly", sk: "Halves through sharing", g1: "Halves & fourths by sharing", g2: "Thirds & sixths by sharing", g3: "Equivalent fractions", g4: "Halves to tenths; decimal tenths", g5: "To twelfths; hundredths; ratios", g6: "Thousandths; unlike denominators; percents" } },
        { name: "Coding", values: { jk: "Follows/gives directions", sk: "Sequences steps", g1: "Sequential code", g2: "Concurrent events", g3: "Repeating loops", g4: "Nested loops", g5: "Conditional statements", g6: "Efficient code with conditionals" } },
        { name: "Money", values: { jk: "Pretend shopping", sk: "Coin names in play", g1: "Coins to 50¢, bills to $50", g2: "Amounts up to $200", g3: "Making change", g4: "Payment methods; saving vs spending", g5: "Budgets, sales tax, credit & debt", g6: "Financial goals; interest rates" } }
      ],
      grades: {
        jk: { focus: "Part of Kindergarten strand A: Foundations of Language and Mathematics.",
          learn: ["Counts small collections by touching each object once", "Recognizes small quantities without counting (1-3)", "Notices and copies simple patterns", "Sorts objects by colour, size or shape", "Uses words like more, less, bigger, smaller"],
          home: ["Count stairs, snacks and toys together", "Make patterns with beads, blocks or claps", "Sort laundry or groceries"] },
        sk: { focus: "Part of Kindergarten strand A: Foundations of Language and Mathematics, with a stronger focus on number sense.",
          learn: ["Counts forward to 30+ and backward from 10", "Understands the last number counted tells 'how many'", "Compares groups and tells which has more", "Creates and extends patterns", "Names and describes 2D and 3D shapes", "Explores early addition and subtraction through stories"],
          home: ["Play board games with dice", "Ask 'How many more do we need?' when setting the table", "Go on a shape hunt around the house"] },
        g1: { focus: "Numbers to 50, addition facts to 10, fair sharing, and first coding.",
          learn: ["Reads, writes, counts and compares numbers to 50", "Recalls addition facts to 10 and related subtraction facts", "Solves addition and subtraction problems with totals up to 50", "Shares fairly and sees that one half equals two fourths", "Creates and describes patterns", "Writes and follows simple step-by-step code", "Identifies Canadian coins up to 50¢ and bills up to $50", "Collects simple data and makes pictographs"],
          home: ["Practise making 10 in different ways (7 + 3, 6 + 4)", "Count coins from a piggy bank", "Play 'robot' - give step-by-step directions to cross a room"] },
        g2: { focus: "Numbers to 200 and quick recall of addition and subtraction facts to 20.",
          learn: ["Counts, compares and orders numbers to 200", "Recalls addition and subtraction facts to 20", "Adds and subtracts numbers with totals up to 100", "Understands multiplication as equal groups and division as sharing", "Shares fairly and sees that one third equals two sixths", "Measures length in centimetres and metres", "Codes with events that happen at the same time", "Shows the same amount of money in different ways, up to $200"],
          home: ["Play quick fact games in the car", "Measure things around the house", "Bake together and talk about halves and quarters"] },
        g3: { focus: "Numbers to 1,000, early multiplication and division, and coding with loops. EQAO math in spring.",
          learn: ["Reads, compares and orders numbers to 1,000", "Adds and subtracts three-digit numbers", "Recalls multiplication facts for 2, 5 and 10", "Understands division as sharing and grouping", "Represents multiplication up to 10 x 10 using arrays", "Finds equivalent fractions through fair sharing", "Writes code with repeating loops", "Calculates change for simple cash purchases"],
          home: ["Skip count by 2s, 5s and 10s", "Ask 'If 4 friends share 12 cookies, how many each?'", "Let your child help count change when shopping"] },
        g4: { focus: "Multiplication facts to 10 x 10, decimals to tenths, and nested loops in coding.",
          learn: ["Reads and compares numbers to 10,000", "Recalls multiplication facts to 10 x 10 and related division facts", "Multiplies and divides two- or three-digit numbers by one-digit numbers", "Understands fractions to tenths and decimal tenths", "Writes code with nested loops", "Finds the area of rectangles and classifies angles", "Explains spending, saving, earning, investing and donating"],
          home: ["Practise times tables with games, cards or apps", "Read prices and compare costs at the grocery store", "Measure a room to find its area"] },
        g5: { focus: "Larger numbers, multiplication facts to 12 x 12, decimals to hundredths, budgeting and conditional statements in code.",
          learn: ["Reads and compares numbers to 100,000", "Recalls multiplication facts to 12 x 12", "Works with decimals to hundredths and adds fractions with like denominators", "Multiplies two-digit by two-digit numbers", "Divides three-digit by two-digit numbers", "Uses coding with conditional statements (if/then)", "Creates simple budgets and calculates sales tax", "Measures angles with a protractor"],
          home: ["Plan a party or outing budget together", "Look at sports stats or weather data", "Try free block-coding sites like Scratch"] },
        g6: { focus: "Numbers to one million, fractions, decimals, ratios, percents and integers. EQAO math in spring.",
          learn: ["Reads and compares numbers to 1,000,000 and decimals to thousandths", "Understands positive and negative integers", "Works with ratios, rates and percents", "Uses divisibility rules and prime factors", "Adds and subtracts fractions with unlike denominators", "Multiplies and divides with decimals and fractions", "Writes efficient code with conditional statements", "Analyses data and probability", "Finds the area of composite shapes and surface area of prisms", "Sets financial goals and understands interest rates"],
          home: ["Calculate discounts and tips (10%, 25%)", "Read temperatures below zero", "Compare unit prices at the store"] }
      }
    },

    /* ----------------------------------------------------------------- SCIENCE */
    {
      id: "sci", name: "Science & Technology", icon: "🔬", color: "#2e9a6b",
      doc: "Ontario Science and Technology curriculum, Grades 1-8 (2022)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/science-technology",
      strands: ["STEM Skills and Connections", "Life Systems", "Matter and Energy", "Structures and Mechanisms", "Earth and Space Systems"],
      intro: "The 2022 curriculum adds a STEM Skills strand in every grade, including scientific inquiry, engineering design, coding and connections to real-world issues.",
      threads: [
        { name: "Life Systems", values: { jk: "Observing nature", sk: "Living vs non-living", g1: "Needs of living things", g2: "Growth and changes in animals", g3: "Growth and changes in plants", g4: "Habitats and communities", g5: "Human organ systems", g6: "Biodiversity" } },
        { name: "Matter & Energy", values: { jk: "Water & sand play", sk: "Exploring materials", g1: "Energy in our lives", g2: "Liquids and solids", g3: "Forces causing movement", g4: "Light and sound", g5: "Properties of and changes in matter", g6: "Electrical phenomena" } },
        { name: "Structures & Mechanisms", values: { jk: "Block building", sk: "Building and testing", g1: "Materials and everyday structures", g2: "Simple machines and movement", g3: "Strong and stable structures", g4: "Machines and mechanisms", g5: "Forces acting on structures", g6: "Flight" } },
        { name: "Earth & Space", values: { jk: "Weather talk", sk: "Seasons", g1: "Daily and seasonal changes", g2: "Air and water in the environment", g3: "Soils in the environment", g4: "Rocks, minerals and erosion", g5: "Conservation of energy and resources", g6: "Space" } }
      ],
      grades: {
        jk: { focus: "Part of Kindergarten strand B: Problem Solving and Innovating (science, engineering and coding).",
          learn: ["Asks 'why' and 'how' questions", "Observes plants, animals and weather", "Explores materials like sand, water and blocks", "Describes what they notice using their senses"],
          home: ["Go on nature walks in a local park or ravine", "Let your child help water plants", "Ask 'What do you think will happen if...?'"] },
        sk: { focus: "Part of Kindergarten strand B: Problem Solving and Innovating, including early coding and engineering design.",
          learn: ["Makes predictions and tests them", "Builds and improves structures", "Notices changes in seasons and weather", "Sorts living and non-living things", "Uses simple tools like magnifiers"],
          home: ["Build with recycled materials", "Track the weather on a calendar", "Plant seeds and watch them grow"] },
        g1: { focus: "Living things, energy, everyday materials and the seasons.",
          learn: ["Describes the needs of living things, including humans", "Identifies sources of energy in daily life", "Investigates materials and how everyday objects are built", "Describes daily and seasonal changes and how they affect living things", "Follows a simple design process to build something"],
          home: ["Talk about how you use energy at home (lights, stove)", "Notice how animals and people change with the seasons"] },
        g2: { focus: "Animals, liquids and solids, simple machines, and air and water.",
          learn: ["Describes how animals grow and change", "Compares properties of liquids and solids", "Investigates simple machines like levers and wheels", "Explains why air and water are important and how to protect them", "Uses inquiry to answer questions"],
          home: ["Freeze and melt things together", "Spot simple machines in the playground", "Talk about saving water"] },
        g3: { focus: "Plants, forces, structures and soils.",
          learn: ["Describes plant life cycles and why plants matter to people", "Investigates forces (push, pull, gravity, magnetism)", "Designs and tests strong, stable structures", "Investigates soil types and their importance", "Records observations and results"],
          home: ["Grow a plant from seed", "Build a tower or bridge from spaghetti and marshmallows", "Visit Allan Gardens or the Toronto Botanical Garden"] },
        g4: { focus: "Habitats, light and sound, machines, and rocks and erosion.",
          learn: ["Describes food chains and how humans affect habitats", "Investigates properties of light and sound", "Builds devices using pulleys and gears", "Identifies rocks and minerals and explains erosion", "Conducts fair tests"],
          home: ["Visit the ROM's earth sciences galleries", "Look for erosion along the Scarborough Bluffs or a ravine", "Make a string telephone"] },
        g5: { focus: "Human organ systems, matter, forces on structures, and conservation of energy.",
          learn: ["Explains how major organ systems work together", "Describes physical and chemical changes in matter", "Analyses forces acting on structures", "Evaluates ways to conserve energy and resources", "Uses an engineering design process"],
          home: ["Talk about healthy habits and how the body works", "Do kitchen chemistry (baking soda and vinegar)", "Do a home energy audit together"] },
        g6: { focus: "Biodiversity, electricity, flight and space.",
          learn: ["Explains biodiversity and why it matters", "Investigates static and current electricity and circuits", "Explains the principles of flight", "Describes the solar system and Canada's contributions to space", "Analyses impacts of technology on society and environment"],
          home: ["Visit the Ontario Science Centre's programs or a planetarium", "Fold and test paper airplanes", "Stargaze outside the city"] }
      }
    },

    /* ---------------------------------------------------------- SOCIAL STUDIES */
    {
      id: "ss", name: "Social Studies", icon: "🌎", color: "#c08a1e",
      doc: "Ontario Social Studies Grades 1-6; History and Geography Grades 7-8 (2018, with 2023 updates)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-sshg",
      strands: ["A. Heritage and Identity", "B. People and Environments"],
      intro: "Each grade has two strands, explored through an inquiry process. First Nations, Metis and Inuit perspectives are woven throughout.",
      threads: [
        { name: "Heritage & Identity", values: { jk: "Me and my family", sk: "My class community", g1: "Our changing roles and responsibilities", g2: "Changing family and community traditions", g3: "Communities in Canada, 1780-1850", g4: "Early societies to 1500 CE", g5: "Indigenous peoples and Europeans before 1713", g6: "Communities in Canada, past and present" } },
        { name: "People & Environments", values: { jk: "Our classroom", sk: "Our neighbourhood", g1: "The local community", g2: "Global communities", g3: "Living and working in Ontario", g4: "Political and physical regions of Canada", g5: "Role of government and responsible citizenship", g6: "Canada's interactions with the global community" } }
      ],
      grades: {
        jk: { focus: "Part of Kindergarten strand D: Belonging and Contributing.",
          learn: ["Talks about themselves and their family", "Shows awareness of others' feelings", "Takes part in classroom routines and jobs", "Notices that people have different traditions"],
          home: ["Share family photos and stories", "Talk about helpers in your neighbourhood"] },
        sk: { focus: "Part of Kindergarten strand D: Belonging and Contributing.",
          learn: ["Describes their role in the classroom community", "Shows respect for diversity", "Recognizes places in their community", "Contributes to group decisions"],
          home: ["Walk your neighbourhood and name places (library, park, fire station)", "Celebrate traditions from different cultures"] },
        g1: { focus: "My roles and responsibilities, and my local community.",
          learn: ["Describes how roles and relationships change over time", "Explains ways to show respect for others", "Identifies places and services in the local community", "Reads and makes simple maps"],
          home: ["Draw a map of your street", "Talk about family responsibilities"] },
        g2: { focus: "Family traditions and communities around the world.",
          learn: ["Compares traditions within their family and community", "Describes how traditions change over time", "Locates continents and oceans on a globe", "Compares how people live in different parts of the world"],
          home: ["Interview a grandparent about traditions", "Find places family members come from on a map"] },
        g3: { focus: "Early communities in Canada (1780-1850) and living and working in Ontario.",
          learn: ["Compares life for First Nations, settlers and Black communities in early Canada", "Describes challenges different groups faced", "Identifies regions of Ontario and land use", "Uses maps, legends and scale"],
          home: ["Visit Black Creek Pioneer Village or Fort York", "Look at how land is used around Toronto"] },
        g4: { focus: "Early societies (to 1500 CE) and regions of Canada.",
          learn: ["Compares daily life in early societies around the world", "Describes how environment shaped early societies", "Names provinces, territories and capitals", "Describes Canada's physical regions"],
          home: ["Visit the ROM's world cultures galleries", "Play map games of Canada"] },
        g5: { focus: "Interactions of Indigenous peoples and Europeans, and the role of government.",
          learn: ["Describes interactions between Indigenous peoples and Europeans before 1713", "Explains different perspectives on historical events", "Describes the roles of municipal, provincial and federal governments", "Explains rights and responsibilities of citizens", "Investigates a social or environmental issue"],
          home: ["Watch a Toronto City Council clip or visit Queen's Park", "Discuss a local issue and who is responsible for it"] },
        g6: { focus: "Communities in Canada past and present, and Canada's role in the world.",
          learn: ["Describes contributions of diverse communities to Canada", "Explains how Canada's identity has developed", "Describes Canada's economic and political relationships with other countries", "Evaluates responses to global issues"],
          home: ["Discuss world news together", "Explore your own family's story of coming to or living in Canada"] }
      }
    },

    /* ------------------------------------------------------ HEALTH & PHYS ED */
    {
      id: "hpe", name: "Health & Physical Education", icon: "⚽", color: "#9b4fc2",
      doc: "Ontario Health and Physical Education curriculum, Grades 1-8 (2019)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-health-and-physical-education",
      strands: ["Social-Emotional Learning Skills", "Active Living", "Movement Competence", "Healthy Living (healthy eating, personal safety, substance use, human development & sexual health, mental health)"],
      intro: "Students build physical skills and healthy habits, along with mental health literacy and online safety. Parents may request that their child be exempted from the Human Development and Sexual Health expectations -- contact the principal.",
      threads: [
        { name: "Movement", values: { jk: "Running, jumping, balancing", sk: "Throwing and catching", g1: "Basic movement skills", g2: "Combining movements", g3: "Applying skills in games", g4: "Strategies in simple games", g5: "Tactics in a range of activities", g6: "Refining skills and tactics" } },
        { name: "Healthy living", values: { jk: "Healthy routines", sk: "Safety rules", g1: "Food choices; body parts; safety", g2: "Healthy eating; caring for self", g3: "Healthy relationships; food origins", g4: "Bullying; safe tech use", g5: "Puberty; self-concept", g6: "Puberty changes; healthy decisions" } }
      ],
      grades: {
        jk: { focus: "Part of Kindergarten strand C: Self-Regulation and Well-Being.",
          learn: ["Runs, jumps, hops and balances", "Washes hands and follows healthy routines", "Names feelings and seeks help", "Knows basic safety rules"],
          home: ["Play outside every day", "Name feelings together ('You look frustrated')"] },
        sk: { focus: "Part of Kindergarten strand C: Self-Regulation and Well-Being.",
          learn: ["Throws, catches and kicks a ball", "Uses calming strategies with support", "Makes healthy food choices", "Knows how to stay safe at school and outdoors"],
          home: ["Practise deep breathing together", "Let your child help make a healthy snack"] },
        g1: { focus: "Basic movement skills, healthy food choices and personal safety.",
          learn: ["Performs basic locomotor and stability skills", "Participates in daily physical activity", "Identifies healthy food choices", "Names body parts using correct terminology", "Knows safety rules at home and school"],
          home: ["Try local TDSB or City of Toronto recreation programs", "Read food labels together"] },
        g2: { focus: "Combining movements and caring for self and others.",
          learn: ["Combines movement skills in games", "Explains benefits of being active", "Describes healthy eating and oral health", "Understands the stages of development", "Knows what to do in unsafe situations"],
          home: ["Bike, scoot or walk together", "Talk about trusted adults"] },
        g3: { focus: "Applying skills in games, healthy relationships and safe choices.",
          learn: ["Applies movement skills in a variety of activities", "Describes characteristics of healthy relationships", "Explains where food comes from", "Recognizes how to stay safe online"],
          home: ["Set up family screen-time and online-safety rules", "Talk about what makes a good friend"] },
        g4: { focus: "Game strategies, bullying prevention and safe technology use.",
          learn: ["Uses simple strategies in games", "Identifies forms of bullying, including cyberbullying, and how to respond", "Explains safe and responsible technology use", "Makes healthy food choices"],
          home: ["Discuss what to do if they see bullying", "Keep devices in shared spaces"] },
        g5: { focus: "Tactics in activities, puberty and self-concept.",
          learn: ["Applies tactics in a range of activities", "Describes physical and emotional changes of puberty", "Explains factors that affect self-concept", "Identifies risks of substance use"],
          home: ["Open the door to conversations about puberty", "Talk about media and body image"] },
        g6: { focus: "Refining skills, puberty changes and healthy decision-making.",
          learn: ["Refines movement skills and tactics", "Explains changes during puberty and personal care", "Makes informed decisions about healthy living", "Understands stereotypes and assumptions", "Recognizes mental health supports"],
          home: ["Encourage at least one activity your child enjoys", "Talk about where to find help (Kids Help Phone: 1-800-668-6868)"] }
      }
    },

    /* ----------------------------------------------------------------- THE ARTS */
    {
      id: "arts", name: "The Arts", icon: "🎨", color: "#d4417f",
      doc: "Ontario The Arts curriculum, Grades 1-8 (2009)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-arts",
      strands: ["Dance", "Drama", "Music", "Visual Arts"],
      intro: "Each of the four arts is taught every year using the creative process (making art) and the critical analysis process (responding to art).",
      threads: [
        { name: "Creating", values: { jk: "Free exploration", sk: "Planned creations", g1: "Basic elements (line, beat, shape)", g2: "Combining elements", g3: "Expressing ideas & feelings", g4: "Using principles of design", g5: "Communicating messages", g6: "Addressing issues through art" } },
        { name: "Responding", values: { jk: "Shares likes", sk: "Describes art", g1: "Shares feelings about works", g2: "Describes choices made", g3: "Explains artistic choices", g4: "Analyses works from cultures", g5: "Compares artistic forms", g6: "Interprets meaning & context" } }
      ],
      grades: {
        jk: { focus: "Part of Kindergarten strand D: Belonging and Contributing (responding to and creating art).",
          learn: ["Explores paint, clay and other materials", "Sings songs and moves to music", "Engages in pretend play", "Shares their creations"],
          home: ["Keep art supplies within reach", "Dance to music together"] },
        sk: { focus: "Part of Kindergarten strand D: Belonging and Contributing (responding to and creating art).",
          learn: ["Plans and creates art with intent", "Keeps a steady beat", "Acts out stories", "Talks about their own and others' art"],
          home: ["Put on puppet shows", "Visit the AGO (free for youth under 25)"] },
        g1: { focus: "Exploring the basic elements of each art form.",
          learn: ["Uses line, shape and colour in visual art", "Keeps a beat and explores rhythm", "Uses body and space in dance", "Takes on a role in drama"],
          home: ["Make music with household objects"] },
        g2: { focus: "Combining elements to communicate ideas.",
          learn: ["Creates art using texture and pattern", "Sings and plays simple rhythms", "Creates short dance sequences", "Uses voice and movement in drama"],
          home: ["Watch a family-friendly performance (Harbourfront Centre has free events)"] },
        g3: { focus: "Expressing ideas and feelings and explaining choices.",
          learn: ["Expresses feelings through art", "Reads simple music notation", "Creates dance phrases", "Develops characters in drama"],
          home: ["Ask 'What did you want people to feel?' about their art"] },
        g4: { focus: "Using principles of design and art from many cultures.",
          learn: ["Applies principles like contrast and emphasis", "Plays recorder or other instruments", "Analyses art from different cultures", "Uses drama to explore issues"],
          home: ["Look at public art around Toronto together"] },
        g5: { focus: "Communicating messages through art.",
          learn: ["Creates art that communicates a message", "Performs music with expression", "Composes dance pieces", "Compares art forms and styles"],
          home: ["Encourage an instrument, choir, or art class if your child is interested"] },
        g6: { focus: "Using the arts to explore issues and interpret meaning.",
          learn: ["Creates art about social or environmental issues", "Reads and performs more complex music", "Uses dance and drama to tell stories", "Interprets the meaning and context of artworks"],
          home: ["Talk about the message in a music video or film"] }
      }
    },

    /* ------------------------------------------------------------------ FRENCH */
    {
      id: "fsl", name: "French", icon: "🇫🇷", color: "#2c8fb0",
      doc: "Ontario French as a Second Language: Core French, Extended French, French Immersion, Grades 1-8 (2013)",
      url: "https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-fsl",
      strands: ["Listening", "Speaking", "Reading", "Writing"],
      intro: "In TDSB's English program, Core French starts in Grade 4. TDSB's French Immersion entry points are JK (Early French Immersion) and Grade 4 (Middle French Immersion). Ontario requires students to have at least 600 hours of French by the end of Grade 8.",
      threads: [
        { name: "English program", values: { jk: "--", sk: "--", g1: "--", g2: "--", g3: "--", g4: "Core French begins", g5: "Core French", g6: "Core French" } },
        { name: "Early French Immersion", values: { jk: "Program begins (in French)", sk: "Immersion", g1: "Immersion", g2: "Immersion", g3: "Immersion", g4: "Immersion", g5: "Immersion", g6: "Immersion" } },
        { name: "Middle French Immersion", values: { jk: "--", sk: "--", g1: "--", g2: "--", g3: "Apply this year", g4: "Program begins", g5: "Immersion", g6: "Immersion" } }
      ],
      grades: {
        jk: { focus: "No French in the English program. In Early French Immersion, learning happens mostly in French.",
          learn: [],
          home: ["If in Immersion: you don't need to speak French -- read to your child in your home language(s)", "Use French songs and shows for exposure"] },
        sk: { focus: "No French in the English program. Early French Immersion continues.",
          learn: [],
          home: ["Keep reading in your home language -- strong first-language skills transfer to French"] },
        g1: { focus: "No French in the English program. Early French Immersion continues.",
          learn: [],
          home: ["Immersion families: ask the teacher about French reading resources from the library"] },
        g2: { focus: "No French in the English program. Early French Immersion continues.",
          learn: [],
          home: ["Try French picture books from the Toronto Public Library"] },
        g3: { focus: "No French in the English program. Families can apply this year for Middle French Immersion starting in Grade 4.",
          learn: [],
          home: ["Check TDSB's Middle French Immersion page for the application window"] },
        g4: { focus: "Core French begins in the English program.",
          learn: ["Understands simple spoken French in familiar contexts", "Uses everyday words and phrases (greetings, numbers, colours)", "Reads simple texts with support", "Writes short sentences using models"],
          home: ["Label items around the house in French", "Use free apps or French cartoons"] },
        g5: { focus: "Core French continues, building confidence speaking and understanding.",
          learn: ["Follows instructions and short conversations in French", "Asks and answers simple questions", "Reads short texts and finds key information", "Writes short paragraphs on familiar topics"],
          home: ["Watch TFO (free Ontario French-language TV) together"] },
        g6: { focus: "Core French continues with longer texts and more spontaneous speaking.",
          learn: ["Understands main ideas in spoken French", "Engages in short spontaneous conversations", "Reads a variety of short texts", "Writes for different purposes with growing accuracy", "Explores francophone cultures in Canada and the world"],
          home: ["Plan a 'French dinner' where everyone tries a few phrases"] }
      }
    }
  ],

  reportCards: {
    timeline: [
      { when: "Fall (Nov)", k: "Kindergarten Communication of Learning: Initial Observations", e: "Elementary Progress Report Card -- no grades; shows 'progressing with difficulty / well / very well' plus learning skills" },
      { when: "Winter (Feb)", k: "Kindergarten Communication of Learning", e: "Provincial Report Card, Term 1 -- letter grades and learning skills" },
      { when: "June", k: "Kindergarten Communication of Learning", e: "Provincial Report Card, Term 2 -- final letter grades for the year" }
    ],
    levels: [
      { level: "4", letters: ["A+", "A", "A-"], pct: "80-100%", meaning: "Exceeds the provincial standard. Thorough knowledge and a high degree of skill.", tone: "l4" },
      { level: "3", letters: ["B+", "B", "B-"], pct: "70-79%", meaning: "Meets the provincial standard. This is the target for every student.", tone: "l3" },
      { level: "2", letters: ["C+", "C", "C-"], pct: "60-69%", meaning: "Approaching the standard. Some knowledge and skill; next steps needed.", tone: "l2" },
      { level: "1", letters: ["D+", "D", "D-"], pct: "50-59%", meaning: "Well below the standard. Limited knowledge and skill; extra support recommended.", tone: "l1" },
      { level: "R", letters: ["R"], pct: "Below 50%", meaning: "Has not yet met the minimum expectations. Talk to the teacher about a support plan.", tone: "lr" },
      { level: "I", letters: ["I"], pct: "--", meaning: "Insufficient evidence to assign a grade (e.g., new to the school or long absence).", tone: "lr" }
    ],
    skills: [
      { name: "Responsibility", desc: "Completes and submits work on time, takes responsibility for own behaviour." },
      { name: "Organization", desc: "Plans and manages time and materials to finish tasks." },
      { name: "Independent Work", desc: "Follows instructions and stays on task with minimal supervision." },
      { name: "Collaboration", desc: "Works well with others, shares ideas and resolves conflicts." },
      { name: "Initiative", desc: "Seeks out new learning, shows curiosity and takes risks." },
      { name: "Self-Regulation", desc: "Sets goals, monitors progress, and perseveres when things are hard." }
    ],
    skillRatings: [
      { code: "E", name: "Excellent" }, { code: "G", name: "Good" }, { code: "S", name: "Satisfactory" }, { code: "N", name: "Needs Improvement" }
    ],
    boxes: [
      { name: "ESL/ELD", desc: "Checked if the child is an English language learner and expectations were modified or accommodations were made." },
      { name: "IEP", desc: "Checked if the child has an Individual Education Plan and the grade reflects modified expectations or accommodations." },
      { name: "French", desc: "Checked if the subject was taught in French (e.g., in French Immersion)." },
      { name: "NA", desc: "Not applicable -- the subject or strand wasn't reported this term." }
    ]
  },

  milestones: [
    { grade: "before", title: "Kindergarten registration", text: "Children start JK in September of the year they turn 4. TDSB kindergarten registration usually opens in the fall/winter before. Register at your local (catchment) school.", tag: "Registration" },
    { grade: "before", title: "Early French Immersion application", text: "TDSB Early French Immersion starts in JK. Apply in the fall (around November) of the year before your child starts JK. Placement in the program is guaranteed for eligible on-time applicants; a specific school is not.", tag: "French" },
    { grade: "jk", title: "First day of school & Initial Observations", text: "Kindergarten uses a gentle start. In the fall you'll receive the Communication of Learning: Initial Observations.", tag: "Report card" },
    { grade: "sk", title: "Ready for Grade 1", text: "Last year of the two-year Kindergarten program. Focus on early reading, writing and number sense.", tag: "Transition" },
    { grade: "g1", title: "Early reading screening & first letter grades", text: "Ontario requires early reading screening (phonics and word reading) in SK to Grade 2. Grade 1 is also the first year of letter grades on the Provincial Report Card.", tag: "Assessment" },
    { grade: "g3", title: "Universal gifted screening (CCAT-7)", text: "TDSB screens all Grade 3 students with the Canadian Cognitive Abilities Test (CCAT-7), usually in the fall. Results help with classroom planning and may lead to further assessment.", tag: "Assessment" },
    { grade: "g3", title: "Middle French Immersion application", text: "Families in the English program can apply during Grade 3 for Middle French Immersion starting in Grade 4.", tag: "French" },
    { grade: "g3", title: "EQAO Primary assessment", text: "Province-wide reading, writing and math assessment, completed online in the spring. Results arrive in the fall of Grade 4.", tag: "EQAO" },
    { grade: "g4", title: "Core French begins", text: "Students in the English program start Core French.", tag: "French" },
    { grade: "g5", title: "Puberty in Health", text: "Human development topics (including puberty) are covered. You may request an exemption from these expectations through the principal.", tag: "Health" },
    { grade: "g6", title: "EQAO Junior assessment", text: "Province-wide reading, writing and math assessment in the spring.", tag: "EQAO" },
    { grade: "g6", title: "Planning for Grade 7", text: "Some TDSB schools are JK-5 or JK-6, so many students change schools for Grade 7. Some specialized programs have application windows in Grade 5 or 6 -- check with your school.", tag: "Transition" }
  ],

  glossary: [
    { term: "Achievement chart", def: "The tool teachers use to assess four categories of learning: Knowledge & Understanding, Thinking, Communication, and Application." },
    { term: "CCAT-7", def: "Canadian Cognitive Abilities Test. TDSB uses it to screen all Grade 3 students for possible giftedness." },
    { term: "Catchment school", def: "Your local school, determined by your home address. Use TDSB's 'Find Your School' tool." },
    { term: "Communication of Learning", def: "The Kindergarten report card. It uses written comments about the four areas of learning, not letter grades." },
    { term: "Core French", def: "A daily French class in the English program, starting in Grade 4 at TDSB." },
    { term: "DECE", def: "Designated Early Childhood Educator. Works alongside the teacher in Kindergarten classes." },
    { term: "EQAO", def: "Education Quality and Accountability Office. Runs the province-wide Grade 3 and Grade 6 reading, writing and math assessments." },
    { term: "ESL / ELD", def: "English as a Second Language / English Literacy Development. Supports for English language learners." },
    { term: "Expectations (overall & specific)", def: "Overall expectations describe the big learning goals by the end of a grade. Specific expectations break them into detailed skills." },
    { term: "Kindergarten strands (frames)", def: "The four areas Kindergarten learning is organized into. In the 2026 program: A. Foundations of Language and Mathematics; B. Problem Solving and Innovating; C. Self-Regulation and Well-Being; D. Belonging and Contributing. Earlier versions called these the four frames." },
    { term: "French Immersion", def: "A program where most instruction is in French. TDSB entry points: JK (Early) and Grade 4 (Middle)." },
    { term: "IEP", def: "Individual Education Plan. A written plan describing accommodations or modified expectations for a student who needs them." },
    { term: "IPRC", def: "Identification, Placement and Review Committee. Formally identifies a student as exceptional (e.g., gifted, learning disability) and recommends placement." },
    { term: "Inquiry-based learning", def: "Learning driven by students' questions and investigations, used across subjects." },
    { term: "Learning skills and work habits", def: "Six skills reported separately from grades: Responsibility, Organization, Independent Work, Collaboration, Initiative, Self-Regulation." },
    { term: "Level 3", def: "The provincial standard. Equivalent to a B range on the report card." },
    { term: "Play-based learning", def: "The Kindergarten approach where children learn through purposeful play guided by educators." },
    { term: "Provincial Report Card", def: "Issued in February and June for Grades 1-8." },
    { term: "Progress Report Card", def: "Issued in the fall for Grades 1-8. Shows how a student is progressing, without grades." },
    { term: "Social-emotional learning (SEL)", def: "Skills like managing stress, building relationships and positive self-concept. Part of Math and Health curricula." },
    { term: "SST", def: "School Support Team. Meets to discuss students who may need extra support or assessment." },
    { term: "Strand", def: "A major area within a subject (e.g., 'Number' in Math, 'Life Systems' in Science)." },
    { term: "Trustee", def: "An elected official who represents your ward on the TDSB board." }
  ],

  sources: [
    { name: "Ontario Curriculum and Resources (Ministry of Education)", url: "https://www.dcp.edu.gov.on.ca/en/curriculum" },
    { name: "Toronto District School Board", url: "https://www.tdsb.on.ca" },
    { name: "TDSB Universal Screening (Grade 3)", url: "https://www.tdsb.on.ca/Learning-Equity-and-Well-Being/Special-Education-and-Inclusion/Universal-Screening" },
    { name: "EQAO", url: "https://www.eqao.com" },
    { name: "Growing Success (Ontario assessment & reporting policy)", url: "https://www.ontario.ca/page/growing-success-assessment-evaluation-and-reporting-ontario-schools" }
  ]
};
