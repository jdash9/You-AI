/*
========================================================
Trivia Database - Embedded Data
========================================================
This file contains the trivia data directly embedded for
reliable loading even when running from file:// protocol.
Keywords must be actual words found in the prompt text.
Each question includes layers for the neural network.
========================================================
*/

const TriviaData = {
  questions: [
    {
      id: 1,
      prompt: "Explain the importance of machine learning in modern healthcare",
      keywords: ["explain", "importance", "machine", "learning", "modern", "healthcare"],
      analysis: { topic: "Machine learning in healthcare", intent: "Understand importance of ML in healthcare", language: "English" },
      layers: [
        { word: "explain", options: [{ text: "Describe", prob: 45, next: ["Overview 60%", "Detailed 30%", "Briefly 10%"] }, { text: "Clarify", prob: 35, next: ["Purpose 55%", "Process 35%", "Context 10%"] }, { text: "Demonstrate", prob: 20, next: ["With examples 70%", "Theoretically 30%"] }] },
        { word: "importance", options: [{ text: "Impact", prob: 50, next: ["Critical 65%", "Moderate 25%", "Low 10%"] }, { text: "Relevance", prob: 30, next: ["High 70%", "Optional 20%", "Emerging 10%"] }, { text: "Necessity", prob: 20, next: ["Essential 80%", "Helpful 15%", "Minimal 5%"] }] },
        { word: "machine", options: [{ text: "Automated", prob: 45, next: ["Disease detection 60%", "Treatment 25%", "Diagnostics 15%"] }, { text: "Computational", prob: 35, next: ["Medical imaging 55%", "Drug discovery 35%", "Surgery 10%"] }, { text: "Robotic", prob: 20, next: ["Assistance 50%", "Surgery 35%", "Rehabilitation 15%"] }] },
        { word: "learning", options: [{ text: "Pattern recognition", prob: 50, next: ["Data-driven 60%", "Image-based 25%", "Text-based 15%"] }, { text: "Model training", prob: 30, next: ["Supervised 55%", "Unsupervised 30%", "Reinforcement 15%"] }, { text: "Prediction", prob: 20, next: ["Forecasting 60%", "Classification 25%", "Regression 15%"] }] },
        { word: "modern", options: [{ text: "Current era", prob: 45, next: ["2020s 60%", "2010s 30%", "Future 10%"] }, { text: "Advanced", prob: 35, next: ["Deep learning 50%", "Neural networks 35%", "Traditional 15%"] }, { text: "Digital", prob: 20, next: ["Transformation 65%", "Integration 25%", "Adoption 10%"] }] },
        { word: "healthcare", options: [{ text: "Medical field", prob: 50, next: ["Diagnosis 55%", "Treatment 30%", "Research 15%"] }, { text: "Patient care", prob: 30, next: ["Personalized 60%", "Efficient 25%", "Accessible 15%"] }, { text: "Clinical practice", prob: 20, next: ["Integration 55%", "Workflow 30%", "Outcomes 15%"] }] }
      ],
      answer: "Machine learning plays a transformative role in modern healthcare by enabling early disease detection through pattern recognition in medical imaging, personalizing treatment plans based on patient data analysis, accelerating drug discovery by predicting molecular interactions, and improving operational efficiency through predictive analytics.\n\nAI-driven diagnostic tools show remarkable accuracy in detecting conditions such as cancer, cardiovascular diseases, and neurological disorders at earlier stages."
    },
    {
      id: 2,
      prompt: "What is the height of Mount Everest?",
      keywords: ["what", "is", "the", "height", "of", "Mount", "Everest"],
      analysis: { topic: "Mount Everest elevation", intent: "Find the exact height of Mount Everest", language: "English" },
      layers: [
        { word: "what", options: [{ text: "Question type", prob: 40, next: ["Asking 50%", "Requesting 30%", "Wondering 20%"] }, { text: "Definition", prob: 35, next: ["Meaning 55%", "Purpose 35%", "Nature 10%"] }, { text: "Identification", prob: 25, next: ["Name 60%", "Type 25%", "Category 15%"] }] },
        { word: "is", options: [{ text: "Verb", prob: 50, next: ["State of being 60%", "Existence 25%", "Identity 15%"] }, { text: "Copula", prob: 30, next: ["Linking 55%", "Describing 35%", "Equating 10%"] }, { text: "Auxiliary", prob: 20, next: ["Present tense 65%", "Progressive 25%", "Passive 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "height", options: [{ text: "Measurement", prob: 55, next: ["Meters 60%", "Feet 30%", "Miles 10%"] }, { text: "Elevation", prob: 30, next: ["Above sea level 75%", "Above ground 15%", "Relative 10%"] }, { text: "Distance", prob: 15, next: ["Vertical 70%", "Horizontal 20%", "Diagonal 10%"] }] },
        { word: "of", options: [{ text: "Relationship", prob: 50, next: ["Part of 55%", "Belonging 30%", "Origin 15%"] }, { text: "Possession", prob: 30, next: ["Ownership 60%", "Association 25%", "Connection 15%"] }, { text: "Composition", prob: 20, next: ["Made from 65%", "Containing 25%", "Material 10%"] }] },
        { word: "Mount", options: [{ text: "Mountain", prob: 50, next: ["Peak 55%", "Range 30%", "Summit 15%"] }, { text: "Summit", prob: 30, next: ["Highest point 65%", "Climbing route 25%", "Base camp 10%"] }, { text: "Elevation", prob: 20, next: ["Geographic 60%", "Geological 30%", "Topographic 10%"] }] },
        { word: "Everest", options: [{ text: "Location", prob: 45, next: ["Himalayas 70%", "Nepal 20%", "Tibet 10%"] }, { text: "Record", prob: 35, next: ["Highest peak 80%", "Most climbed 15%", "Most dangerous 5%"] }, { text: "Geography", prob: 20, next: ["Formation 50%", "Climate 30%", "Ecosystem 20%"] }] }
      ],
      answer: "Mount Everest, the highest mountain on Earth, has an officially recognized height of 8,848.86 meters (29,031.7 feet) above sea level. This measurement was established in 2020 by China and Nepal through a joint survey.\n\nThe mountain is located in the Mahalangur Himal sub-range of the Himalayas, on the border between Nepal and Tibet."
    },
    {
      id: 3,
      prompt: "Who wrote the play Romeo and Juliet?",
      keywords: ["who", "wrote", "the", "play", "Romeo", "and", "Juliet"],
      analysis: { topic: "Shakespearean literature", intent: "Identify the author of Romeo and Juliet", language: "English" },
      layers: [
        { word: "who", options: [{ text: "Person", prob: 50, next: ["Author 60%", "Composer 25%", "Creator 15%"] }, { text: "Identity", prob: 30, next: ["Famous person 55%", "Historical figure 35%", "Unknown 10%"] }, { text: "Question word", prob: 20, next: ["Asking about 65%", "Requesting info 25%", "Seeking 10%"] }] },
        { word: "wrote", options: [{ text: "Author", prob: 55, next: ["Playwright 60%", "Poet 25%", "Novelist 15%"] }, { text: "Created", prob: 30, next: ["Original work 65%", "Adaptation 25%", "Translation 10%"] }, { text: "Composed", prob: 15, next: ["Script 55%", "Story 35%", "Poem 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "play", options: [{ text: "Theater", prob: 50, next: ["Drama 60%", "Tragedy 30%", "Comedy 10%"] }, { text: "Performance", prob: 30, next: ["Stage 55%", "Screen 30%", "Reading 15%"] }, { text: "Work", prob: 20, next: ["Literary 60%", "Famous 30%", "Classic 10%"] }] },
        { word: "Romeo", options: [{ text: "Character", prob: 55, next: ["Male lead 70%", "Montague 25%", "Young lover 5%"] }, { text: "Name", prob: 30, next: ["Italian 60%", "Famous 30%", "Literary 10%"] }, { text: "Role", prob: 15, next: ["Protagonist 75%", "Tragic hero 20%", "Symbol 5%"] }] },
        { word: "and", options: [{ text: "Conjunction", prob: 55, next: ["Linking 60%", "Adding 30%", "Joining 10%"] }, { text: "Connection", prob: 30, next: ["Between 55%", "Together 35%", "Parallel 10%"] }, { text: "Relationship", prob: 15, next: ["Pair 65%", "Duo 25%", "Combination 10%"] }] },
        { word: "Juliet", options: [{ text: "Character", prob: 55, next: ["Female lead 70%", "Capulet 25%", "Young lover 5%"] }, { text: "Name", prob: 30, next: ["Italian 60%", "Famous 30%", "Literary 10%"] }, { text: "Role", prob: 15, next: ["Protagonist 75%", "Tragic hero 20%", "Symbol 5%"] }] }
      ],
      answer: "The play Romeo and Juliet was written by William Shakespeare, the renowned English playwright and poet. It was composed between 1591 and 1596.\n\nThe tragedy tells the story of two young star-crossed lovers whose deaths ultimately reconcile their feuding families."
    },
    {
      id: 4,
      prompt: "What is the chemical formula of water?",
      keywords: ["what", "is", "the", "chemical", "formula", "of", "water"],
      analysis: { topic: "Water molecular structure", intent: "Determine the chemical composition of water", language: "English" },
      layers: [
        { word: "what", options: [{ text: "Question type", prob: 40, next: ["Asking 50%", "Requesting 30%", "Wondering 20%"] }, { text: "Definition", prob: 35, next: ["Meaning 55%", "Purpose 35%", "Nature 10%"] }, { text: "Identification", prob: 25, next: ["Name 60%", "Type 25%", "Category 15%"] }] },
        { word: "is", options: [{ text: "Verb", prob: 50, next: ["State of being 60%", "Existence 25%", "Identity 15%"] }, { text: "Copula", prob: 30, next: ["Linking 55%", "Describing 35%", "Equating 10%"] }, { text: "Auxiliary", prob: 20, next: ["Present tense 65%", "Progressive 25%", "Passive 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "chemical", options: [{ text: "Science", prob: 50, next: ["H2O 70%", "NaCl 20%", "CO2 10%"] }, { text: "Molecular", prob: 35, next: ["Structure 55%", "Bonding 35%", "Properties 10%"] }, { text: "Composition", prob: 15, next: ["Elements 60%", "Compounds 30%", "Mixtures 10%"] }] },
        { word: "formula", options: [{ text: "Notation", prob: 50, next: ["Symbolic 65%", "Written 25%", "Standard 10%"] }, { text: "Equation", prob: 30, next: ["Balanced 60%", "Chemical 30%", "Molecular 10%"] }, { text: "Expression", prob: 20, next: ["Scientific 55%", "Mathematical 35%", "Technical 10%"] }] },
        { word: "of", options: [{ text: "Relationship", prob: 50, next: ["Part of 55%", "Belonging 30%", "Origin 15%"] }, { text: "Possession", prob: 30, next: ["Ownership 60%", "Association 25%", "Connection 15%"] }, { text: "Composition", prob: 20, next: ["Made from 65%", "Containing 25%", "Material 10%"] }] },
        { word: "water", options: [{ text: "Substance", prob: 50, next: ["H2O 75%", "H2O2 15%", "H3O 10%"] }, { text: "Molecule", prob: 30, next: ["Two hydrogen 60%", "One oxygen 30%", "Polar 10%"] }, { text: "Compound", prob: 20, next: ["Universal solvent 60%", "Polar molecule 30%", "Amphoteric 10%"] }] }
      ],
      answer: "The chemical formula of water is H2O, which means each water molecule consists of two hydrogen atoms covalently bonded to a single oxygen atom.\n\nWater is a polar molecule with unique properties: it is liquid at room temperature, has high surface tension, expands when freezing, and is called the 'universal solvent'."
    },
    {
      id: 5,
      prompt: "What is the capital city of Japan?",
      keywords: ["what", "is", "the", "capital", "city", "of", "Japan"],
      analysis: { topic: "Japanese geography", intent: "Find the capital city of Japan", language: "English" },
      layers: [
        { word: "what", options: [{ text: "Question type", prob: 40, next: ["Asking 50%", "Requesting 30%", "Wondering 20%"] }, { text: "Definition", prob: 35, next: ["Meaning 55%", "Purpose 35%", "Nature 10%"] }, { text: "Identification", prob: 25, next: ["Name 60%", "Type 25%", "Category 15%"] }] },
        { word: "is", options: [{ text: "Verb", prob: 50, next: ["State of being 60%", "Existence 25%", "Identity 15%"] }, { text: "Copula", prob: 30, next: ["Linking 55%", "Describing 35%", "Equating 10%"] }, { text: "Auxiliary", prob: 20, next: ["Present tense 65%", "Progressive 25%", "Passive 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "capital", options: [{ text: "Location", prob: 50, next: ["Tokyo 80%", "Kyoto 15%", "Osaka 5%"] }, { text: "Government", prob: 30, next: ["Seat of power 65%", "Administration 25%", "Politics 10%"] }, { text: "Finance", prob: 20, next: ["Investment 55%", "Banking 35%", "Economy 10%"] }] },
        { word: "city", options: [{ text: "Urban area", prob: 50, next: ["Tokyo 70%", "Osaka 20%", "Nagoya 10%"] }, { text: "Metropolis", prob: 30, next: ["Largest 60%", "Oldest 25%", "Famous 15%"] }, { text: "Place", prob: 20, next: ["Historical 55%", "Modern 35%", "Traditional 10%"] }] },
        { word: "of", options: [{ text: "Relationship", prob: 50, next: ["Part of 55%", "Belonging 30%", "Origin 15%"] }, { text: "Possession", prob: 30, next: ["Ownership 60%", "Association 25%", "Connection 15%"] }, { text: "Composition", prob: 20, next: ["Made from 65%", "Containing 25%", "Material 10%"] }] },
        { word: "Japan", options: [{ text: "Country", prob: 50, next: ["Tokyo 80%", "Kyoto 15%", "Osaka 5%"] }, { text: "Culture", prob: 30, next: ["Traditional 55%", "Modern 35%", "Mix 10%"] }, { text: "Geography", prob: 20, next: ["Archipelago 60%", "Mountainous 25%", "Coastal 15%"] }] }
      ],
      answer: "The capital city of Japan is Tokyo. Originally a small fishing village called Edo, it became the de facto capital in 1603.\n\nTokyo is one of the world's most populous metropolitan areas, with over 37 million residents in the Greater Tokyo Area."
    },
    {
      id: 6,
      prompt: "Explain the process of photosynthesis",
      keywords: ["explain", "the", "process", "of", "photosynthesis"],
      analysis: { topic: "Photosynthesis in plants", intent: "Understand how photosynthesis works", language: "English" },
      layers: [
        { word: "explain", options: [{ text: "Describe", prob: 45, next: ["Overview 60%", "Detailed 30%", "Briefly 10%"] }, { text: "Clarify", prob: 35, next: ["Purpose 55%", "Process 35%", "Context 10%"] }, { text: "Demonstrate", prob: 20, next: ["With examples 70%", "Theoretically 30%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "process", options: [{ text: "Mechanism", prob: 50, next: ["Light energy 60%", "CO2 fixation 30%", "Water splitting 10%"] }, { text: "Steps", prob: 30, next: ["Chlorophyll absorption 55%", "Glucose production 35%", "Oxygen release 10%"] }, { text: "System", prob: 20, next: ["Natural 65%", "Efficient 25%", "Complex 10%"] }] },
        { word: "of", options: [{ text: "Relationship", prob: 50, next: ["Part of 55%", "Belonging 30%", "Origin 15%"] }, { text: "Possession", prob: 30, next: ["Ownership 60%", "Association 25%", "Connection 15%"] }, { text: "Composition", prob: 20, next: ["Made from 65%", "Containing 25%", "Material 10%"] }] },
        { word: "photosynthesis", options: [{ text: "Energy conversion", prob: 55, next: ["Light to chemical 70%", "Solar to glucose 25%", "Photons to energy 5%"] }, { text: "Plant biology", prob: 30, next: ["Chloroplasts 55%", "Chlorophyll 35%", "Leaves 10%"] }, { text: "Carbon cycle", prob: 15, next: ["CO2 fixation 60%", "Oxygen release 30%", "Sugar production 10%"] }] }
      ],
      answer: "Photosynthesis is the process by which green plants convert light energy into chemical energy stored in glucose.\n\nThe chemical equation is: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2. During the light-dependent reactions, chlorophyll absorbs sunlight and splits water molecules, releasing oxygen."
    },
    {
      id: 7,
      prompt: "What is the speed of light in vacuum?",
      keywords: ["what", "is", "the", "speed", "of", "light", "in", "vacuum"],
      analysis: { topic: "Speed of light constant", intent: "Determine the exact speed of light", language: "English" },
      layers: [
        { word: "what", options: [{ text: "Question type", prob: 40, next: ["Asking 50%", "Requesting 30%", "Wondering 20%"] }, { text: "Definition", prob: 35, next: ["Meaning 55%", "Purpose 35%", "Nature 10%"] }, { text: "Identification", prob: 25, next: ["Name 60%", "Type 25%", "Category 15%"] }] },
        { word: "is", options: [{ text: "Verb", prob: 50, next: ["State of being 60%", "Existence 25%", "Identity 15%"] }, { text: "Copula", prob: 30, next: ["Linking 55%", "Describing 35%", "Equating 10%"] }, { text: "Auxiliary", prob: 20, next: ["Present tense 65%", "Progressive 25%", "Passive 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "speed", options: [{ text: "Velocity", prob: 50, next: ["299792458 m/s 90%", "300000 km/s 8%", "186000 mi/s 2%"] }, { text: "Measurement", prob: 30, next: ["Exact value 65%", "Approximate 25%", "Range 10%"] }, { text: "Constant", prob: 20, next: ["Physical law 60%", "Universal 30%", "Fundamental 10%"] }] },
        { word: "of", options: [{ text: "Relationship", prob: 50, next: ["Part of 55%", "Belonging 30%", "Origin 15%"] }, { text: "Possession", prob: 30, next: ["Ownership 60%", "Association 25%", "Connection 15%"] }, { text: "Composition", prob: 20, next: ["Made from 65%", "Containing 25%", "Material 10%"] }] },
        { word: "light", options: [{ text: "Electromagnetic", prob: 50, next: ["Visible spectrum 60%", "Photons 30%", "Waves 10%"] }, { text: "Radiation", prob: 30, next: ["Speed of propagation 65%", "Frequency 25%", "Intensity 10%"] }, { text: "Energy", prob: 20, next: ["Particle nature 55%", "Wave nature 35%", "Both 10%"] }] },
        { word: "in", options: [{ text: "Preposition", prob: 50, next: ["Location 60%", "Condition 25%", "Context 15%"] }, { text: "Medium", prob: 30, next: ["Vacuum 55%", "Water 35%", "Air 10%"] }, { text: "Environment", prob: 20, next: ["Space 65%", "Laboratory 25%", "Natural 10%"] }] },
        { word: "vacuum", options: [{ text: "Empty space", prob: 50, next: ["299792458 m/s 90%", "300000 km/s 8%", "186000 mi/s 2%"] }, { text: "No medium", prob: 30, next: ["Absolute 60%", "Near-perfect 30%", "Partial 10%"] }, { text: "Pure environment", prob: 20, next: ["Controlled 65%", "Ideal 25%", "Natural 10%"] }] }
      ],
      answer: "The speed of light in a vacuum is exactly 299,792,458 meters per second (approximately 300,000 km/s or 186,282 miles per second).\n\nAccording to Einstein's theory of special relativity, this is the maximum speed at which all energy, matter, and information can travel."
    },
    {
      id: 8,
      prompt: "What is the largest ocean on Earth?",
      keywords: ["what", "is", "the", "largest", "ocean", "on", "Earth"],
      analysis: { topic: "World oceans", intent: "Identify the largest ocean on Earth", language: "English" },
      layers: [
        { word: "what", options: [{ text: "Question type", prob: 40, next: ["Asking 50%", "Requesting 30%", "Wondering 20%"] }, { text: "Definition", prob: 35, next: ["Meaning 55%", "Purpose 35%", "Nature 10%"] }, { text: "Identification", prob: 25, next: ["Name 60%", "Type 25%", "Category 15%"] }] },
        { word: "is", options: [{ text: "Verb", prob: 50, next: ["State of being 60%", "Existence 25%", "Identity 15%"] }, { text: "Copula", prob: 30, next: ["Linking 55%", "Describing 35%", "Equating 10%"] }, { text: "Auxiliary", prob: 20, next: ["Present tense 65%", "Progressive 25%", "Passive 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "largest", options: [{ text: "Size", prob: 50, next: ["Pacific 80%", "Atlantic 15%", "Indian 5%"] }, { text: "Rank", prob: 30, next: ["Number one 65%", "Biggest 25%", "Greatest 10%"] }, { text: "Comparison", prob: 20, next: ["Vs Atlantic 55%", "Vs Indian 35%", "Vs Arctic 10%"] }] },
        { word: "ocean", options: [{ text: "Water body", prob: 50, next: ["Pacific 75%", "Atlantic 15%", "Indian 10%"] }, { text: "Geography", prob: 30, next: ["Major oceans 55%", "Ocean floor 35%", "Currents 10%"] }, { text: "Ecosystem", prob: 20, next: ["Marine life 60%", "Coral reefs 25%", "Deep ocean 15%"] }] },
        { word: "on", options: [{ text: "Preposition", prob: 50, next: ["Location 60%", "Surface 25%", "Above 15%"] }, { text: "Position", prob: 30, next: ["Geographic 55%", "Spatial 35%", "Relative 10%"] }, { text: "Contact", prob: 20, next: ["Sitting on 65%", "Resting on 25%", "Floating on 10%"] }] },
        { word: "Earth", options: [{ text: "Planet", prob: 50, next: ["Pacific 70%", "Atlantic 20%", "Indian 10%"] }, { text: "World", prob: 30, next: ["Global 55%", "Continental 35%", "Atmospheric 10%"] }, { text: "Geography", prob: 20, next: ["Surface 60%", "Water coverage 30%", "Land mass 10%"] }] }
      ],
      answer: "The Pacific Ocean is the largest and deepest ocean on Earth, covering approximately 165.25 million square kilometers.\n\nIts deepest point is the Mariana Trench's Challenger Deep, reaching approximately 11,034 meters below sea level."
    },
    {
      id: 9,
      prompt: "How does the internet work?",
      keywords: ["how", "does", "the", "internet", "work"],
      analysis: { topic: "Internet infrastructure", intent: "Understand how the internet functions", language: "English" },
      layers: [
        { word: "how", options: [{ text: "Method", prob: 50, next: ["Process 60%", "Mechanism 30%", "Procedure 10%"] }, { text: "Way", prob: 30, next: ["Through packets 55%", "Via routers 35%", "By cables 10%"] }, { text: "Manner", prob: 20, next: ["Technically 65%", "Simply 25%", "Advanced 10%"] }] },
        { word: "does", options: [{ text: "Auxiliary verb", prob: 55, next: ["Present tense 65%", "Action 25%", "State 10%"] }, { text: "Action", prob: 30, next: ["Operates 55%", "Functions 35%", "Performs 10%"] }, { text: "Function", prob: 15, next: ["Works 65%", "Runs 25%", "Executes 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "internet", options: [{ text: "Network", prob: 50, next: ["Packets 60%", "Routers 25%", "Servers 15%"] }, { text: "Technology", prob: 30, next: ["TCP/IP 55%", "HTTP 35%", "DNS 10%"] }, { text: "System", prob: 20, next: ["Distributed 65%", "Decentralized 25%", "Client-server 10%"] }] },
        { word: "work", options: [{ text: "Function", prob: 50, next: ["Data transmission 60%", "Packet switching 25%", "Routing 15%"] }, { text: "Operation", prob: 30, next: ["IP addresses 55%", "DNS resolution 35%", "Caching 10%"] }, { text: "Mechanism", prob: 20, next: ["Hardware 55%", "Software 35%", "Protocols 10%"] }] }
      ],
      answer: "The internet is a global network of interconnected computers that communicate using standardized protocols.\n\nData is broken into small packets using the Internet Protocol (IP) and transmitted through routers across the network using Transmission Control Protocol (TCP)."
    },
    {
      id: 10,
      prompt: "What is the theory of evolution by natural selection?",
      keywords: ["what", "is", "the", "theory", "of", "evolution", "by", "natural", "selection"],
      analysis: { topic: "Evolutionary biology", intent: "Explain the theory of evolution by natural selection", language: "English" },
      layers: [
        { word: "what", options: [{ text: "Question type", prob: 40, next: ["Asking 50%", "Requesting 30%", "Wondering 20%"] }, { text: "Definition", prob: 35, next: ["Meaning 55%", "Purpose 35%", "Nature 10%"] }, { text: "Identification", prob: 25, next: ["Name 60%", "Type 25%", "Category 15%"] }] },
        { word: "is", options: [{ text: "Verb", prob: 50, next: ["State of being 60%", "Existence 25%", "Identity 15%"] }, { text: "Copula", prob: 30, next: ["Linking 55%", "Describing 35%", "Equating 10%"] }, { text: "Auxiliary", prob: 20, next: ["Present tense 65%", "Progressive 25%", "Passive 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "theory", options: [{ text: "Scientific concept", prob: 50, next: ["Darwin 70%", "Wallace 20%", "Lamarck 10%"] }, { text: "Explanation", prob: 30, next: ["Natural selection 65%", "Mutation 25%", "Drift 10%"] }, { text: "Framework", prob: 20, next: ["Variation 55%", "Inheritance 35%", "Selection 10%"] }] },
        { word: "of", options: [{ text: "Relationship", prob: 50, next: ["Part of 55%", "Belonging 30%", "Origin 15%"] }, { text: "Possession", prob: 30, next: ["Ownership 60%", "Association 25%", "Connection 15%"] }, { text: "Composition", prob: 20, next: ["Made from 65%", "Containing 25%", "Material 10%"] }] },
        { word: "evolution", options: [{ text: "Change over time", prob: 50, next: ["Species adaptation 60%", "Population change 25%", "Speciation 15%"] }, { text: "Development", prob: 30, next: ["Gradual 55%", "Progressive 35%", "Adaptive 10%"] }, { text: "Biological process", prob: 20, next: ["Genetic 65%", "Morphological 25%", "Behavioral 10%"] }] },
        { word: "by", options: [{ text: "Preposition", prob: 50, next: ["Means of 60%", "Through 25%", "Using 15%"] }, { text: "Agent", prob: 30, next: ["Natural forces 55%", "Environment 35%", "Time 10%"] }, { text: "Method", prob: 20, next: ["Selection 65%", "Adaptation 25%", "Mutation 10%"] }] },
        { word: "natural", options: [{ text: "Not artificial", prob: 50, next: ["Selection 75%", "Mutation 15%", "Drift 10%"] }, { text: "Biological", prob: 30, next: ["Processes 60%", "Laws 25%", "Forces 15%"] }, { text: "Environmental", prob: 20, next: ["Pressure 65%", "Factors 25%", "Conditions 10%"] }] },
        { word: "selection", options: [{ text: "Natural process", prob: 50, next: ["Survival of fittest 60%", "Environmental pressure 30%", "Competition 10%"] }, { text: "Filtering", prob: 30, next: ["Traits 55%", "Genes 35%", "Phenotypes 10%"] }, { text: "Mechanism", prob: 20, next: ["Reproductive success 65%", "Adaptation 25%", "Speciation 10%"] }] }
      ],
      answer: "The theory of evolution by natural selection, proposed by Charles Darwin in his 1859 book 'On the Origin of Species', explains how species change over time through variation, inheritance, selection, and time.\n\nBeneficial traits become more common in populations over generations, leading to adaptation and the formation of new species."
    },
    {
      id: 11,
      prompt: "What is the human body's largest organ?",
      keywords: ["what", "is", "the", "human", "body's", "largest", "organ"],
      analysis: { topic: "Human anatomy", intent: "Identify the largest organ in the human body", language: "English" },
      layers: [
        { word: "what", options: [{ text: "Question type", prob: 40, next: ["Asking 50%", "Requesting 30%", "Wondering 20%"] }, { text: "Definition", prob: 35, next: ["Meaning 55%", "Purpose 35%", "Nature 10%"] }, { text: "Identification", prob: 25, next: ["Name 60%", "Type 25%", "Category 15%"] }] },
        { word: "is", options: [{ text: "Verb", prob: 50, next: ["State of being 60%", "Existence 25%", "Identity 15%"] }, { text: "Copula", prob: 30, next: ["Linking 55%", "Describing 35%", "Equating 10%"] }, { text: "Auxiliary", prob: 20, next: ["Present tense 65%", "Progressive 25%", "Passive 10%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "human", options: [{ text: "Biological", prob: 50, next: ["Body 60%", "Anatomy 25%", "Physiology 15%"] }, { text: "Species", prob: 30, next: ["Homo sapiens 65%", "Mammals 25%", "Primates 10%"] }, { text: "Characteristic", prob: 20, next: ["Organs 55%", "Systems 35%", "Cells 10%"] }] },
        { word: "body's", options: [{ text: "Anatomy", prob: 50, next: ["Skin 70%", "Liver 15%", "Brain 15%"] }, { text: "Possession", prob: 30, next: ["Organs 55%", "Tissues 35%", "Cells 10%"] }, { text: "System", prob: 20, next: ["Circulatory 55%", "Nervous 35%", "Digestive 10%"] }] },
        { word: "largest", options: [{ text: "Size", prob: 50, next: ["Skin 80%", "Liver 15%", "Lungs 5%"] }, { text: "Superlative", prob: 30, next: ["Most extensive 65%", "Most prominent 25%", "Most visible 10%"] }, { text: "Rank", prob: 20, next: ["Number one 60%", "Biggest 30%", "Most important 10%"] }] },
        { word: "organ", options: [{ text: "Body part", prob: 50, next: ["Skin 75%", "Liver 15%", "Heart 10%"] }, { text: "Biological", prob: 30, next: ["Tissue 55%", "System 35%", "Function 10%"] }, { text: "Anatomy", prob: 20, next: ["Protective 65%", "Regulatory 25%", "Sensory 10%"] }] }
      ],
      answer: "The skin is the largest organ of the human body, covering about 1.5 to 2 square meters and accounting for approximately 15% of total body weight.\n\nThe skin has three main layers: the epidermis, dermis, and hypodermis, serving vital functions including protection, temperature regulation, and sensation."
    },
    {
      id: 12,
      prompt: "Explain the concept of artificial intelligence",
      keywords: ["explain", "the", "concept", "of", "artificial", "intelligence"],
      analysis: { topic: "Artificial intelligence fundamentals", intent: "Understand what artificial intelligence is", language: "English" },
      layers: [
        { word: "explain", options: [{ text: "Describe", prob: 45, next: ["Overview 60%", "Detailed 30%", "Briefly 10%"] }, { text: "Clarify", prob: 35, next: ["Purpose 55%", "Process 35%", "Context 10%"] }, { text: "Demonstrate", prob: 20, next: ["With examples 70%", "Theoretically 30%"] }] },
        { word: "the", options: [{ text: "Article", prob: 55, next: ["Definite 70%", "Specific 20%", "General 10%"] }, { text: "Determiner", prob: 30, next: ["Pointing 60%", "Referring 30%", "Identifying 10%"] }, { text: "Word class", prob: 15, next: ["English 65%", "Grammar 25%", "Linguistics 10%"] }] },
        { word: "concept", options: [{ text: "Idea", prob: 50, next: ["Neural networks 60%", "Machine learning 25%", "Robotics 15%"] }, { text: "Definition", prob: 30, next: ["Simulation 55%", "Automation 35%", "Prediction 10%"] }, { text: "Theory", prob: 20, next: ["Strong AI 65%", "Narrow AI 25%", "AGI 10%"] }] },
        { word: "of", options: [{ text: "Relationship", prob: 50, next: ["Part of 55%", "Belonging 30%", "Origin 15%"] }, { text: "Possession", prob: 30, next: ["Ownership 60%", "Association 25%", "Connection 15%"] }, { text: "Composition", prob: 20, next: ["Made from 65%", "Containing 25%", "Material 10%"] }] },
        { word: "artificial", options: [{ text: "Synthetic", prob: 50, next: ["Machine learning 60%", "Deep learning 25%", "Rule-based 15%"] }, { text: "Computer", prob: 30, next: ["Generated 55%", "Programmed 35%", "Automated 10%"] }, { text: "Human-like", prob: 20, next: ["Mimicking 65%", "Replicating 25%", "Emulating 10%"] }] },
        { word: "intelligence", options: [{ text: "Cognition", prob: 50, next: ["Reasoning 60%", "Learning 25%", "Problem-solving 15%"] }, { text: "Capability", prob: 30, next: ["Decision making 55%", "Pattern recognition 35%", "Language understanding 10%"] }, { text: "Mental process", prob: 20, next: ["Neural computation 65%", "Data processing 25%", "Knowledge representation 10%"] }] }
      ],
      answer: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think, learn, and make decisions.\n\nModern AI systems use neural networks inspired by the human brain, processing vast amounts of data to recognize patterns and make predictions."
    }
  ]
};