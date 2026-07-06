/*
========================================================
Trivia Database - Embedded Data (Optimized)
========================================================
This file contains the trivia data directly embedded for
reliable loading even when running from file:// protocol.
Keywords must be actual words found in the prompt text.
Each question includes layers for the neural network.
========================================================
*/

// Common, highly-duplicated grammar layers shared across multiple questions
const SharedLayers = {
  "explain": {
    "word": "explain",
    "options": [
      { "text": "Describe", "prob": 45, "next": ["Overview 60%", "Detailed 30%", "Briefly 10%"] },
      { "text": "Clarify", "prob": 35, "next": ["Purpose 55%", "Process 35%", "Context 10%"] },
      { "text": "Demonstrate", "prob": 20, "next": ["With examples 70%", "Theoretically 30%"] }
    ]
  },
  "what": {
    "word": "what",
    "options": [
      { "text": "Question type", "prob": 40, "next": ["Asking 50%", "Requesting 30%", "Wondering 20%"] },
      { "text": "Definition", "prob": 35, "next": ["Meaning 55%", "Purpose 35%", "Nature 10%"] },
      { "text": "Identification", "prob": 25, "next": ["Name 60%", "Type 25%", "Category 15%"] }
    ]
  },
  "is": {
    "word": "is",
    "options": [
      { "text": "Verb", "prob": 50, "next": ["State of being 60%", "Existence 25%", "Identity 15%"] },
      { "text": "Copula", "prob": 30, "next": ["Linking 55%", "Describing 35%", "Equating 10%"] },
      { "text": "Auxiliary", "prob": 20, "next": ["Present tense 65%", "Progressive 25%", "Passive 10%"] }
    ]
  },
  "the": {
    "word": "the",
    "options": [
      { "text": "Article", "prob": 55, "next": ["Definite 70%", "Specific 20%", "General 10%"] },
      { "text": "Determiner", "prob": 30, "next": ["Pointing 60%", "Referring 30%", "Identifying 10%"] },
      { "text": "Word class", "prob": 15, "next": ["English 65%", "Grammar 25%", "Linguistics 10%"] }
    ]
  },
  "of": {
    "word": "of",
    "options": [
      { "text": "Relationship", "prob": 50, "next": ["Part of 55%", "Belonging 30%", "Origin 15%"] },
      { "text": "Possession", "prob": 30, "next": ["Ownership 60%", "Association 25%", "Connection 15%"] },
      { "text": "Composition", "prob": 20, "next": ["Made from 65%", "Containing 25%", "Material 10%"] }
    ]
  }
};

const TriviaData = {
  "questions": [
    {
      "id": 1,
      "prompt": "Explain the importance of machine learning in modern healthcare",
      "keywords": ["explain", "importance", "machine", "learning", "modern", "healthcare"],
      "layers": [
        SharedLayers.explain,
        {
          "word": "importance",
          "options": [
            { "text": "Impact", "prob": 50, "next": ["Critical 65%", "Moderate 25%", "Low 10%"] },
            { "text": "Relevance", "prob": 30, "next": ["High 70%", "Optional 20%", "Emerging 10%"] },
            { "text": "Necessity", "prob": 20, "next": ["Essential 80%", "Helpful 15%", "Minimal 5%"] }
          ]
        },
        {
          "word": "machine",
          "options": [
            { "text": "Automated", "prob": 45, "next": ["Disease detection 60%", "Treatment 25%", "Diagnostics 15%"] },
            { "text": "Computational", "prob": 35, "next": ["Medical imaging 55%", "Drug discovery 35%", "Surgery 10%"] },
            { "text": "Robotic", "prob": 20, "next": ["Assistance 50%", "Surgery 35%", "Rehabilitation 15%"] }
          ]
        },
        {
          "word": "learning",
          "options": [
            { "text": "Pattern recognition", "prob": 50, "next": ["Data-driven 60%", "Image-based 25%", "Text-based 15%"] },
            { "text": "Model training", "prob": 30, "next": ["Supervised 55%", "Unsupervised 30%", "Reinforcement 15%"] },
            { "text": "Prediction", "prob": 20, "next": ["Forecasting 60%", "Classification 25%", "Regression 15%"] }
          ]
        },
        {
          "word": "modern",
          "options": [
            { "text": "Current era", "prob": 45, "next": ["2020s 60%", "2010s 30%", "Future 10%"] },
            { "text": "Advanced", "prob": 35, "next": ["Deep learning 50%", "Neural networks 35%", "Traditional 15%"] },
            { "text": "Digital", "prob": 20, "next": ["Transformation 65%", "Integration 25%", "Adoption 10%"] }
          ]
        },
        {
          "word": "healthcare",
          "options": [
            { "text": "Medical field", "prob": 50, "next": ["Diagnosis 55%", "Treatment 30%", "Research 15%"] },
            { "text": "Patient care", "prob": 30, "next": ["Personalized 60%", "Efficient 25%", "Accessible 15%"] },
            { "text": "Clinical practice", "prob": 20, "next": ["Integration 55%", "Workflow 30%", "Outcomes 15%"] }
          ]
        }
      ],
      "outputAnswers": [
        { "label": "Disease detection", "text": "Machine learning helps healthcare systems spot diseases earlier by analyzing medical images, lab results, and patient history. It can flag warning signs before symptoms become severe." },
        { "label": "Treatment", "text": "Machine learning supports treatment planning by matching patients with therapies that fit their data and expected outcomes. It helps doctors personalize care and reduce trial-and-error." },
        { "label": "Diagnostics", "text": "Machine learning improves diagnostics by detecting subtle patterns in scans, bloodwork, and symptoms that might be easy to miss. It makes clinical decisions faster and more consistent." },
        { "label": "Overview", "text": "Machine learning fundamentally redefines healthcare by shifting the industry from a reactive model to a proactive, predictive approach across clinical and administrative workflows." },
        { "label": "Detailed", "text": "By integrating advanced deep learning models with electronic health records, genomics, and real-time biometric feeds, machine learning creates a highly granular framework for systemic medical optimization." },
        { "label": "Briefly", "text": "Machine learning makes healthcare smarter, faster, and more precise by processing vast amounts of patient data to optimize medical outcomes." },
        { "label": "Purpose", "text": "The core objective of implementing machine learning is to enhance human clinical expertise, mitigate diagnostic error, and lower global medical delivery costs." },
        { "label": "Process", "text": "The implementation process involves feeding vast, diverse medical data streams into computational algorithms, which iteratively refine their internal parameters to improve prediction accuracy." },
        { "label": "Context", "text": "Amid unprecedented global medical staff shortages and an aging demographic burden, machine learning provides the necessary operational leverage to sustain modern medical infrastructure." },
        { "label": "With examples", "text": "For example, Google's DeepMind predicts 3D protein structures to design targeted therapies, while FDA-cleared AI tools flags potential strokes on brain CT scans within minutes." },
        { "label": "Theoretically", "text": "Theoretically, machine learning exploits high-dimensional vector spaces to uncover complex non-linear correlations in physiological variables that defy standard statistical modeling." },
        { "label": "Critical", "text": "Machine learning has a critical impact on patient survival rates by dramatically shortening the window between early symptom recognition and targeted therapeutic intervention." },
        { "label": "Moderate", "text": "Machine learning exerts a moderate influence on standard clinical operations by automating routine administrative tasks, freeing up valuable facetime for patient-provider interaction." },
        { "label": "Low", "text": "Machine learning currently plays a low-impact role in direct manual surgical manipulation, where physical human dexterity and real-time haptic intuition remain entirely paramount." },
        { "label": "High", "text": "The high relevance of machine learning is driven by the sheer volume of unstructured medical data generated daily, which is functionally impossible for human physicians to manual process alone." },
        { "label": "Optional", "text": "While machine learning is optional for small boutique wellness practices, it has become virtually non-negotiable for large-scale urban medical networks handling high patient volumes." },
        { "label": "Emerging", "text": "An emerging application is generative AI architecture, which drafts clinical notes from ambient doctor-patient conversations and simplifies dense medical jargon for discharge papers." },
        { "label": "Essential", "text": "Machine learning has become essential for rare disease management, where it aggregates global patient registries to discover tiny, hidden patterns across minuscule patient cohorts." },
        { "label": "Helpful", "text": "The technology serves as a helpful digital assistant for medical triaging, sorting routine non-urgent inquiries away from emergency care pipelines to manage hospital workflows." },
        { "label": "Minimal", "text": "The reliance on machine learning remains minimal in rural regions lacking digital health infrastructure, highlighting a persistent socioeconomic gap in technological deployment." },
        { "label": "Medical imaging", "text": "Computer vision models analyze radiological scans, MRIs, and pathology slides with pixel-level precision, often pinpointing micro-malignancies years before they become visible to the naked eye." },
        { "label": "Drug discovery", "text": "Computational models drastically compress traditional drug discovery timelines from a decade down to months by simulating molecular interactions and predicting chemical toxicity in silico." },
        { "label": "Surgery", "text": "During computer-assisted surgery, predictive models overlay real-time anatomical maps onto the surgeon's display, dynamically charting vascular pathways to prevent accidental tears." },
        { "label": "Assistance", "text": "AI assistance tools continuously screen inpatient vitals, executing real-time risk scoring to alert floor nurses hours before a patient enters septic shock or cardiac arrest." },
        { "label": "Rehabilitation", "text": "In physical rehabilitation, machine learning processes data from wearable sensors to track physical therapy form, adjusting exoskeleton resistance levels to optimize muscle recovery." },
        { "label": "Data-driven", "text": "Data-driven algorithms process millions of past clinical endpoints simultaneously, extracting empirical rules of thumb to guide evidence-based institutional care paths." },
        { "label": "Image-based", "text": "Image-based models utilize deep convolutional neural networks to classify dermal lesions, retinal photographs, and colonoscopies, standardizing diagnostic baseline quality globally." },
        { "label": "Text-based", "text": "Text-based natural language processing parses millions of chaotic, unstructured clinical dictation notes to harvest hidden epidemiologic insights and track adverse drug side effects." },
        { "label": "Supervised", "text": "Supervised model training relies heavily on massive, human-annotated datasets—like biopsy slides meticulously labeled by pathologists—to teach algorithms what specific anomalies look like." },
        { "label": "Unsupervised", "text": "Unsupervised algorithms comb through unorganized multi-omic patient profiles to cluster totally novel, previously undefined subtypes of complex syndromes like type 2 diabetes." },
        { "label": "Reinforcement", "text": "Reinforcement learning techniques optimize dynamic, multi-step treatment regimens by constantly calculating the long-term trade-offs of sequential medication dosing adjustments." },
        { "label": "Forecasting", "text": "Forecasting algorithms predict seasonal emergency department surge patterns and ICU bed utilization rates, enabling proactive hospital staff scheduling and supply procurement." },
        { "label": "Classification", "text": "Classification networks quickly bucket incoming echocardiogram signals into definitive diagnostic bins, sorting benign structural variances from severe valvular diseases." },
        { "label": "Regression", "text": "Regression modeling correlates continuous lifestyle metrics—like sleep, step counts, and caloric intake—with exact long-term trends in a patient's average blood glucose levels." },
        { "label": "2020s", "text": "The 2020s era is characterized by widespread integration of transformer architectures and multimodal medical models that natively understand text, code, images, and genomic tables simultaneously." },
        { "label": "2010s", "text": "The 2010s era laid the foundational groundwork, pivoting heavily around the initial breakthroughs of narrow convolutional networks outperforming humans in isolated image recognition benchmarks." },
        { "label": "Future", "text": "The future ecosystem points toward autonomous medical agents managing continuous closed-loop physiological monitoring and crafting real-time custom molecular therapies at the bedside." },
        { "label": "Deep learning", "text": "Deep learning uses multi-layered neural architectures to automatically engineer visual features from raw pixels, eliminating the need for tedious manual human feature selection." },
        { "label": "Neural networks", "text": "Modeled loosely on biological brains, artificial neural networks pass digital signals through hidden layers to build highly abstract, resilient conceptual understandings of clinical data." },
        { "label": "Traditional", "text": "Traditional machine learning techniques, such as random forests and logistic regressions, remain popular for structured laboratory panels due to their high mathematical interpretability." },
        { "label": "Transformation", "text": "The ongoing digital transformation forces paper-heavy, siloed hospital bureaucracies to migrate into clean, interconnected databases optimized for algorithmic analysis." },
        { "label": "Integration", "text": "True integration means embedding machine learning natively within legacy Epic and Cerner electronic health records software, preventing workflow fragmentation for doctors." },
        { "label": "Adoption", "text": "Widespread clinical adoption hinges tightly on resolving lingering medical malpractice liabilities, establishing ethical data boundaries, and clearing stringent regulatory approval loops." },
        { "label": "Diagnosis", "text": "By synthesizing multi-source data points instantly, machine learning eliminates diagnostic blind spots, radically lowering the frequency of costly, life-threatening misdiagnoses." },
        { "label": "Research", "text": "AI accelerates fundamental clinical research by parsing millions of academic medical papers simultaneously to generate completely novel hypotheses regarding oncological pathways." },
        { "label": "Personalized", "text": "Personalized medicine shifts away from one-size-fits-all treatments, matching a patient's exact genetic profile and lifestyle habits with customized molecular therapeutic targets." },
        { "label": "Efficient", "text": "Efficient operational pipelines use predictive models to minimize operating room turnaround delays, automate coding audits, and radically reduce patient length-of-stay metrics." },
        { "label": "Accessible", "text": "By powering smartphone-based screening apps, machine learning extends expert-level specialist diagnostic access to isolated, underserved rural populations worldwide." },
        { "label": "Workflow", "text": "Algorithmic triage optimizes the daily clinical workflow, ensuring that the most critical, life-threatening scans are pushed directly to the top of a radiologist's review queue." },
        { "label": "Outcomes", "text": "Ultimately, the incorporation of machine learning correlates directly with improved patient outcomes, lower 30-day readmission metrics, and decreased overall hospital mortality rates." }
      ],
      "answer": "Machine learning plays a transformative role in modern healthcare by enabling early disease detection through pattern recognition in medical imaging, personalizing treatment plans based on patient data analysis, accelerating drug discovery by predicting molecular interactions, and improving operational efficiency through predictive analytics.\n\nAI-driven diagnostic tools show remarkable accuracy in detecting conditions such as cancer, cardiovascular diseases, and neurological disorders at earlier stages."
    },
    {
      "id": 2,
      "prompt": "What is the height of Mount Everest?",
      "keywords": ["what", "is", "the", "height", "of", "Mount", "Everest"],
      "analysis": { "topic": "Mount Everest elevation", "intent": "Find the exact height of Mount Everest", "language": "English" },
      "layers": [
        SharedLayers.what,
        SharedLayers.is,
        SharedLayers.the,
        {
          "word": "height",
          "options": [
            { "text": "Measurement", "prob": 55, "next": ["Meters 60%", "Feet 30%", "Miles 10%"] },
            { "text": "Elevation", "prob": 30, "next": ["Above sea level 75%", "Above ground 15%", "Relative 10%"] },
            { "text": "Distance", "prob": 15, "next": ["Vertical 70%", "Horizontal 20%", "Diagonal 10%"] }
          ]
        },
        SharedLayers.of,
        {
          "word": "Mount",
          "options": [
            { "text": "Mountain", "prob": 50, "next": ["Peak 55%", "Range 30%", "Summit 15%"] },
            { "text": "Summit", "prob": 30, "next": ["Highest point 65%", "Climbing route 25%", "Base camp 10%"] },
            { "text": "Elevation", "prob": 20, "next": ["Geographic 60%", "Geological 30%", "Topographic 10%"] }
          ]
        },
        {
          "word": "Everest",
          "options": [
            { "text": "Location", "prob": 45, "next": ["Himalayas 70%", "Nepal 20%", "Tibet 10%"] },
            { "text": "Record", "prob": 35, "next": ["Highest peak 80%", "Most climbed 15%", "Most dangerous 5%"] },
            { "text": "Geography", "prob": 20, "next": ["Formation 50%", "Climate 30%", "Ecosystem 20%"] }
          ]
        }
      ],
      "outputAnswers": [
        { "label": "Peak", "text": "A peak is the highest point of a mountain, so this answer feels direct and topographic. It fits the idea of mountain elevation more naturally than a path or a base point." },
        { "label": "Range", "text": "A range is a chain of mountains rather than the height of one mountain, so this answer feels broader and more geographic. It frames the question in terms of the surrounding landscape." },
        { "label": "Summit", "text": "The summit is the very top of the mountain, which makes it feel like the most dramatic and literal answer to the height question. It sounds like the specific point you would reach at the top." },
        { "label": "Highest point", "text": "The highest point is a precise way to describe the peak of Mount Everest. It emphasizes the mountain's elevation without giving a number, which makes it sound thoughtful and descriptive." },
        { "label": "Climbing route", "text": "A climbing route is a path up the mountain, not the mountain's height. This answer feels practical and expedition-based rather than quantitative." },
        { "label": "Base camp", "text": "Base camp is where climbers prepare before the ascent, so it feels logistical and expedition-focused. It is associated with mountain travel rather than measurement." },
        { "label": "Geographic", "text": "Geographic is a broad descriptive term that places Mount Everest in the landscape. It feels contextual and scientific rather than directly numerical." },
        { "label": "Geological", "text": "Geological describes the formation and structure of the mountain. It focuses on how Mount Everest was shaped over time rather than how tall it is." },
        { "label": "Topographic", "text": "Topographic describes the mountain's physical shape and relief. It sounds technical and cartographic, which makes it feel like a specialist's answer." },
        { "label": "Meters", "text": "Mount Everest is 8,848.86 meters tall, which is the standard scientific measurement used in modern geography. That value is the most precise and widely accepted figure for the mountain's height." },
        { "label": "Feet", "text": "Mount Everest stands about 29,031.7 feet above sea level, which is the familiar imperial measurement many people use in everyday conversation. It gives the height a more human-scale perspective." },
        { "label": "Miles", "text": "Mount Everest is roughly 5.5 miles high, which sounds dramatic and easy to picture. That makes it feel like a giant mountain in a way that is both simple and memorable." },
        { "label": "Asking", "text": "Asking indicates a direct prompt seeking information. It implies that the user expects a straightforward, quantitative fact to resolve an inquiry about the natural world." },
        { "label": "Requesting", "text": "Requesting frames the query as a formal appeal for data. It indicates an analytical approach where the user expects a precise data point to be retrieved and delivered." },
        { "label": "Wondering", "text": "Wondering gives the prompt an inquisitive, curious tone. It hints at casual interest or a trivia-based motivation behind learning the mountain's true scale." },
        { "label": "Meaning", "text": "Meaning focuses on the linguistic intent behind the phrase, interpreting 'what is' as an effort to establish a definitive baseline fact about a subject." },
        { "label": "Purpose", "text": "Purpose evaluates why the question is posed, identifying the core objective as anchoring a specific geographic landmark within human-defined metrics." },
        { "label": "Nature", "text": "Nature looks at the intrinsic quality of the question, defining it as a structural query about the physical properties of a monumental natural object." },
        { "label": "Name", "text": "Name treats the opening word as an identifier, linking the request to a unique geographical entity known to the world as Mount Everest." },
        { "label": "Type", "text": "Type categories the prompt as a factual, closed-ended query that demands a specific unit of distance rather than an essay or open-ended interpretation." },
        { "label": "Category", "text": "Category buckets the query within global geography trivia, establishing that the answer belongs alongside planetary records and physical earth data." },
        { "label": "State of being", "text": "State of being treats 'is' as a declaration of absolute physical reality, looking at the permanent, measurable existence of the mountain in space and time." },
        { "label": "Existence", "text": "Existence emphasizes that the height is a real, measurable property of an actual physical landmass standing on the planet today." },
        { "label": "Identity", "text": "Identity uses the verb to tightly couple the subject, Mount Everest, with its defining mathematical attribute—its world-record elevation." },
        { "label": "Linking", "text": "Linking views the word as a structural bridge, connecting the target subject directly to the descriptive measurement fields that follow it." },
        { "label": "Describing", "text": "Describing views the copula as an assignment tool, prepping the system to assign a numeric profile to the physical geometry of the peak." },
        { "label": "Equating", "text": "Equating sets up a mathematical balance, stating that the concept of 'Everest's height' is perfectly equal to a specific, survey-verified number." },
        { "label": "Present tense", "text": "Present tense anchors the measurement in the current epoch, confirming that this is the active, officially recognized calculation accepted today." },
        { "label": "Progressive", "text": "Progressive hints at continuous state, a relevant semantic nuance given that tectonic activity causes the mountain's actual height to slowly change over time." },
        { "label": "Passive", "text": "Passive contextualizes the height as an observed quality, an attribute that is constantly being evaluated and verified by external human geographers." },
        { "label": "Definite", "text": "Definite signals that the question is targeted at one unique, specific property of the mountain, leaving no room for ambiguous interpretations." },
        { "label": "Specific", "text": "Specific underscores that the user is not looking for general mountain stats, but rather the exact vertical dimension of this single, isolated peak." },
        { "label": "General", "text": "General steps back to acknowledge 'the' as a universal grammar piece, a functional block used to isolate an object within everyday speech patterns." },
        { "label": "Pointing", "text": "Pointing highlights the determiner's role in focusing the system's attention squarely onto the specific physical attribute requested: the height." },
        { "label": "Referring", "text": "Referring notes that the word pulls contextual focus directly to an established, singular dimension that belongs exclusively to the subject mountain." },
        { "label": "Identifying", "text": "Identifying shows that the word helps separate the exact concept of total elevation away from other possible topics like climate or history." },
        { "label": "English", "text": "English labels the base linguistic framework of the text block, indicating that the response should align with Western standard structural rules." },
        { "label": "Grammar", "text": "Grammar looks at how the syntax is ordered, showing a standard noun-phrase configuration optimized to pull a quantitative fact from a database." },
        { "label": "Linguistics", "text": "Linguistics analyzes the syntax as an informational query structure, dissecting how human vocabulary isolates specific metrics of physical objects." },
        { "label": "Above sea level", "text": "Above sea level is the essential baseline for global geography, using the mean ocean surface as zero to calculate standard mountain altitudinal data." },
        { "label": "Above ground", "text": "Above ground evaluates the mountain from its immediate structural base, a metric that measures true topographic prominence rather than global altitude." },
        { "label": "Relative", "text": "Relative compares Everest's height against nearby Himalayan neighbors like K2 or Lhotse, emphasizing its dominance within its local range." },
        { "label": "Vertical", "text": "Vertical isolates the pure plumb-line distance extending directly straight up from sea level to the highest molecule of snow on the summit." },
        { "label": "Horizontal", "text": "Horizontal moves attention away from altitude to look at the massive spatial footprint and lateral baseline diameter of the mountain's root structure." },
        { "label": "Diagonal", "text": "Diagonal paths map out the long, sloped lines of ascent that climbers actually trek along to traverse the massive distance up the ridgelines." },
        { "label": "Part of", "text": "Part of denotes that the height is just one single component metric chosen from a massive web of geographic details defining the mountain." },
        { "label": "Belonging", "text": "Belonging emphasizes the possessive relationship, verifying that the target measurement is an intrinsic property tied directly to Everest itself." },
        { "label": "Origin", "text": "Origin tracks where the data stems from, indicating that the height measurement is derived directly from the physical mass of the peak." },
        { "label": "Ownership", "text": "Ownership frames the height as an exclusive characteristic, a specific statistical record held securely by this particular geographical monument." },
        { "label": "Association", "text": "Association highlights how the word connects a conceptual dimension—height—to a concrete, physical feature anchored on the earth's surface." },
        { "label": "Connection", "text": "Connection patterns the word as a relational link, joining an abstract measurement concept with the legendary name of the peak." },
        { "label": "Made from", "text": "Made from pivots to look at composition, indicating that the height spans across layers of ancient marine limestone, shale, and metamorphic rock." },
        { "label": "Containing", "text": "Containing treats the vertical mass as a vessel holding vast glaciers, sheer ice walls, and the remnants of historic mountaineering expeditions." },
        { "label": "Material", "text": "Material shifts the focus onto the physical substances—rock, ice, and packed snow—that together comprise the total measured height." },
        { "label": "Himalayas", "text": "The Himalayas serve as the vast parent mountain system, a massive tectonic collision zone containing the highest collection of peaks on Earth." },
        { "label": "Nepal", "text": "Nepal contains the southern face of the mountain, hosting the famous South Col climbing route and managing the peak via Sagarmatha National Park." },
        { "label": "Tibet", "text": "Tibet encompasses the northern side of the mountain, offering the alternative North Ridge route and framing the peak as Chomolungma." },
        { "label": "Highest peak", "text": "The highest peak label represents Everest's crown jewel status: it is the point on Earth that extends furthest above global sea level." },
        { "label": "Most climbed", "text": "Most climbed reflects its massive global draw, attracting hundreds of mountaineers every spring despite the extreme costs and severe physical toll." },
        { "label": "Most dangerous", "text": "Most dangerous acknowledges the extreme risks involved, highlighting the technical hazards of the Khumbu Icefall and the lethal, oxygen-deprived Death Zone." },
        { "label": "Formation", "text": "Formation tracks its ongoing growth, driven by the Indian tectonic plate continually pushing upward into the Eurasian plate at a rate of a few millimeters per year." },
        { "label": "Climate", "text": "Climate defines the extreme weather patterns dictating life on the peak, marked by hurricane-force jet stream winds and sub-zero temperatures." },
        { "label": "Ecosystem", "text": "Ecosystem maps out the stark, barren alpine environment found at extreme altitudes, where virtually no plants or animals can permanently survive." }
      ],
      "answer": "Mount Everest, the highest mountain on Earth, has an officially recognized height of 8,848.86 meters (29,031.7 feet) above sea level. This measurement was established in 2020 by China and Nepal through a joint survey.\n\nThe mountain is located in the Mahalangur Himal sub-range of the Himalayas, on the border between Nepal and Tibet."
    },
    {
      "id": 3,
      "prompt": "Who wrote the play Romeo and Juliet?",
      "keywords": ["who", "wrote", "the", "play", "Romeo", "and", "Juliet"],
      "analysis": { "topic": "Shakespearean literature", "intent": "Identify the author of Romeo and Juliet", "language": "English" },
      "layers": [
        {
          "word": "who",
          "options": [
            { "text": "Person", "prob": 50, "next": ["Author 60%", "Composer 25%", "Creator 15%"] },
            { "text": "Identity", "prob": 30, "next": ["Famous person 55%", "Historical figure 35%", "Unknown 10%"] },
            { "text": "Question word", "prob": 20, "next": ["Asking about 65%", "Requesting info 25%", "Seeking 10%"] }
          ]
        },
        {
          "word": "wrote",
          "options": [
            { "text": "Author", "prob": 55, "next": ["Playwright 60%", "Poet 25%", "Novelist 15%"] },
            { "text": "Created", "prob": 30, "next": ["Original work 65%", "Adaptation 25%", "Translation 10%"] },
            { "text": "Composed", "prob": 15, "next": ["Script 55%", "Story 35%", "Poem 10%"] }
          ]
        },
        SharedLayers.the,
        {
          "word": "play",
          "options": [
            { "text": "Theater", "prob": 50, "next": ["Drama 60%", "Tragedy 30%", "Comedy 10%"] },
            { "text": "Performance", "prob": 30, "next": ["Stage 55%", "Screen 30%", "Reading 15%"] },
            { "text": "Work", "prob": 20, "next": ["Literary 60%", "Famous 30%", "Classic 10%"] }
          ]
        },
        {
          "word": "Romeo",
          "options": [
            { "text": "Character", "prob": 55, "next": ["Male lead 70%", "Montague 25%", "Young lover 5%"] },
            { "text": "Name", "prob": 30, "next": ["Italian 60%", "Famous 30%", "Literary 10%"] },
            { "text": "Role", "prob": 15, "next": ["Protagonist 75%", "Tragic hero 20%", "Symbol 5%"] }
          ]
        },
        {
          "word": "and",
          "options": [
            { "text": "Conjunction", "prob": 55, "next": ["Linking 60%", "Adding 30%", "Joining 10%"] },
            { "text": "Connection", "prob": 30, "next": ["Between 55%", "Together 35%", "Parallel 10%"] },
            { "text": "Relationship", "prob": 15, "next": ["Pair 65%", "Duo 25%", "Combination 10%"] }
          ]
        },
        {
          "word": "Juliet",
          "options": [
            { "text": "Character", "prob": 55, "next": ["Female lead 70%", "Capulet 25%", "Young lover 5%"] },
            { "text": "Name", "prob": 30, "next": ["Italian 60%", "Famous 30%", "Literary 10%"] },
            { "text": "Role", "prob": 15, "next": ["Protagonist 75%", "Tragic hero 20%", "Symbol 5%"] }
          ]
        }
      ],
      "outputAnswers": [
        { "label": "Author", "text": "The play was written by William Shakespeare, one of the most influential writers in English literature. His work shaped the way tragic romance is imagined in theater." },
        { "label": "Playwright", "text": "Romeo and Juliet is a classic play written by a playwright whose stories still define the stage today. Shakespeare's language and emotional drama continue to resonate across centuries." },
        { "label": "Novelist", "text": "The story is often associated with a novelist-like genius of storytelling, but in this case it was written as a play. Shakespeare combined poetry, conflict, and emotion into a dramatic masterpiece." },
        { "label": "Composer", "text": "A composer shapes musical pieces, score arrangements, and operas. While Shakespeare's words have been set to beautiful music for generations, he worked in prose and verse rather than musical notation." },
        { "label": "Creator", "text": "The creator of this tragic world assembled unforgettable characters and vivid settings. This framing emphasizes his imaginative role as the conceptual master behind Verona's legendary feuding families." },
        { "label": "Famous person", "text": "The play traces back to an exceptionally famous historical figure from the Elizabethan era. This option frames the creator through his enduring global fame and massive historical celebrity profile." },
        { "label": "Historical figure", "text": "As a historical figure of early modern England, Shakespeare left behind records of his acting troupe and real-world properties. This grounds the playwright as a real person living in Renaissance London." },
        { "label": "Unknown", "text": "An unknown authorship theory is sometimes pushed by alternative history enthusiasts, but historical evidence firmly points to Shakespeare. Labeling it unknown leans into fringe literary debates." },
        { "label": "Asking about", "text": "Asking about the creator signals that the user wants to identify the single mind responsible for the text. It targets the identity of the person behind the historic script." },
        { "label": "Requesting info", "text": "Requesting info implies an analytical search for literary facts. The focus here is on pulling accurate historical metadata about early theater history out of a broad data knowledge base." },
        { "label": "Seeking", "text": "Seeking highlights an inquisitive desire to find a definitive answer, approaching the prompt like a literary trivia quest looking to unlock the proper historical name." },
        { "label": "Poet", "text": "Shakespeare was a brilliant poet who composed the play primarily in blank verse and exquisite iambic pentameter. This option highlights his mastery of poetic structure over basic theatrical staging." },
        { "label": "Original work", "text": "An original theatrical work in terms of language, though Shakespeare famously drew plot points from older Italian tales. This frames the play as a highly innovative stamp on a classic romance trope." },
        { "label": "Adaptation", "text": "The work serves as a brilliant adaptation of Arthur Brooke's 1562 narrative poem. This angle highlights Shakespeare's talent for transforming existing prose stories into dynamic, gripping stage performances." },
        { "label": "Translation", "text": "A translation would mean changing words from another language, but Shakespeare built the text natively in Early Modern English. This descriptor doesn't fit the creative authorship of the text." },
        { "label": "Script", "text": "The script functions as a functional blueprint for theatrical actors, complete with cue lines and sparse stage directions. It emphasizes the raw written dialogue designed for live stage delivery." },
        { "label": "Story", "text": "The story captures the timeless narrative arc of the narrative itself—the core emotional journey of two young lovers that bypasses the structural format of acts and stage entries." },
        { "label": "Poem", "text": "The text behaves much like an extended poem, featuring embedded sonnets and incredibly rich metaphors throughout. This treats the tragedy as a supreme achievement in structured English verse." },
        { "label": "Definite", "text": "The definite article isolates one specific, legendary performance script out of the millions written. It alerts the system that the user has an exact target masterpiece in mind." },
        { "label": "Specific", "text": "Specific focus keeps the attention squarely on this exact theatrical work, filtering away other historic plays or generic romantic dramas from the final search result." },
        { "label": "General", "text": "General grammar rules use the definite article to transform a common noun like 'play' into a universally recognized monument of English literature." },
        { "label": "Pointing", "text": "Pointing acts like a finger pointing right at the title, anchoring the linguistic connection between the act of writing and the specific target text that follows." },
        { "label": "Referring", "text": "Referring links the abstract action of writing directly to the concrete cultural object under discussion, streamlining the focus of the query." },
        { "label": "Identifying", "text": "Identifying serves to tell the engine that the upcoming words form a single proper noun phrase, signaling that the entire title must be read as one unique work." },
        { "label": "English", "text": "English establishes the baseline vocabulary and historical linguistic setting of the piece, anchoring the response within the Western literary canon." },
        { "label": "Grammar", "text": "Grammar maps out the syntax of a classic wh-question, standardizing the order of the words so a database can easily interpret the target subject and action." },
        { "label": "Linguistics", "text": "Linguistics studies how the query phrases constructs meaning, examining how single terms build context to request information about historical authorship." },
        { "label": "Drama", "text": "Drama highlights the intense theatrical conflict, highlighting the powerful tension, pacing, and human dialogue that give the tragic story its unique life on stage." },
        { "label": "Tragedy", "text": "A tragedy defines the specific dramatic genre where the main characters meet an unhappy ending. It frames the query around a story marked by fate, grief, and loss." },
        { "label": "Comedy", "text": "A comedy would mean a lighthearted plot with a happy resolution, usually ending in a marriage. While the play starts with witty banter, its dark ending makes this label incorrect." },
        { "label": "Stage", "text": "The stage represents the physical, live platform where the dialogue is brought to life by actors, focusing on how the written lines translate to visual blockings." },
        { "label": "Screen", "text": "The screen points to the many modern cinema and television adaptations of the work. This moves the focus from the original Elizabethan playhouse to modern multimedia." },
        { "label": "Reading", "text": "Reading looks at the work as a text piece on a page, focusing on how students and theater lovers engage with the metaphors and dialogue through quiet study." },
        { "label": "Literary", "text": "Literary value places the text inside the high artistic world of classic books, analyzing its rich verse, complex themes, and deep influence on global storytelling." },
        { "label": "Famous", "text": "Famous standing emphasizes how easily recognized the work is worldwide. It shows that the query focuses on a household name known across cultures." },
        { "label": "Classic", "text": "Classic status means the work has stood the test of time, keeping its deep cultural relevance and emotional power centuries after its first performance." },
        { "label": "Male lead", "text": "The male lead character represents the young heir of the Montague house, focusing the query on the thoughts, actions, and tragic destiny of the title hero." },
        { "label": "Montague", "text": "Montague names the noble family line locked in a bitter, bloody feud with the Capulets, providing the essential social conflict that drives the entire plot." },
        { "label": "Young lover", "text": "A young lover archetype highlights the innocent, intense passion that defies family hatred, focusing on themes of teenage romance and impulsive devotion." },
        { "label": "Italian", "text": "The Italian flavor honors the story's setting in Verona, capturing the hot-blooded passion, street fights, and Renaissance romance of its historical backdrop." },
        { "label": "Protagonist", "text": "The protagonist designation focuses on the main characters who drive the action forward, highlighting how their personal choices steer the course of the drama." },
        { "label": "Tragic hero", "text": "A tragic hero is a noble character born with a fatal flaw that leads straight to their downfall, framing the story as an exploration of fate and human error." },
        { "label": "Symbol", "text": "A symbol of romantic devotion, the name has become a universal shorthand in modern culture for any deeply passionate or completely love-struck young man." },
        { "label": "Linking", "text": "Linking shows how the conjunction connects two independent people into a single, unbreakable pair, forming the iconic dual title of the tragedy." },
        { "label": "Adding", "text": "Adding shows how the word builds the title by bringing the two main characters together, ensuring both names receive equal weight in the story." },
        { "label": "Joining", "text": "Joining highlights the grammar bond that bridges the two lovers, mirroring how their lives and ultimate fates are completely bound together." },
        { "label": "Between", "text": "Between emphasizes the relationship shared by the two leads, setting up the space where their romance grows despite their families' hatred." },
        { "label": "Together", "text": "Together shows that the two characters are viewed as a single unit, emphasizing that their story can only be understood when they are paired." },
        { "label": "Parallel", "text": "Parallel structure gives equal weight to both names, showing that the play belongs to both leads equally rather than favoring one over the other." },
        { "label": "Pair", "text": "A pair label treats the characters as a classic romantic couple, emphasizing how their lives complement each other within the dramatic framework." },
        { "label": "Duo", "text": "The duo framing looks at the leads as a classic theatrical team, focusing on how their dialogue balances and contrasts throughout the performance." },
        { "label": "Combination", "text": "A combination views the titles as a blend of two distinct family lines, showing how their union breaks down the dividing walls of Verona." },
        { "label": "Female lead", "text": "The female lead character represents the young daughter of the Capulet family, tracking her growth from an innocent girl to a deeply courageous woman." },
        { "label": "Capulet", "text": "Capulet identifies the powerful family line that opposes the Montagues, establishing the dangerous domestic world where the heroine must hide her love." }
      ],
      "answer": "The play Romeo and Juliet was written by William Shakespeare, the renowned English playwright and poet. It was composed between 1591 and 1596.\n\nThe tragedy tells the story of two young star-crossed lovers whose deaths ultimately reconcile their feuding families."
    },
    {
      "id": 4,
      "prompt": "What is the chemical formula of water?",
      "keywords": ["what", "is", "the", "chemical", "formula", "of", "water"],
      "analysis": { "topic": "Water molecular structure", "intent": "Determine the chemical composition of water", "language": "English" },
      "layers": [
        SharedLayers.what,
        SharedLayers.is,
        SharedLayers.the,
        {
          "word": "chemical",
          "options": [
            { "text": "Science", "prob": 50, "next": ["H2O 70%", "NaCl 20%", "CO2 10%"] },
            { "text": "Molecular", "prob": 35, "next": ["Structure 55%", "Bonding 35%", "Properties 10%"] },
            { "text": "Composition", "prob": 15, "next": ["Elements 60%", "Compounds 30%", "Mixtures 10%"] }
          ]
        },
        {
          "word": "formula",
          "options": [
            { "text": "Notation", "prob": 50, "next": ["Symbolic 65%", "Written 25%", "Standard 10%"] },
            { "text": "Equation", "prob": 30, "next": ["Balanced 60%", "Chemical 30%", "Molecular 10%"] },
            { "text": "Expression", "prob": 20, "next": ["Scientific 55%", "Mathematical 35%", "Technical 10%"] }
          ]
        },
        SharedLayers.of,
        {
          "word": "water",
          "options": [
            { "text": "Substance", "prob": 50, "next": ["H2O 75%", "H2O2 15%", "H3O 10%"] },
            { "text": "Molecule", "prob": 30, "next": ["Two hydrogen 60%", "One oxygen 30%", "Polar 10%"] },
            { "text": "Compound", "prob": 20, "next": ["Universal solvent 60%", "Polar molecule 30%", "Amphoteric 10%"] }
          ]
        }
      ],
      "outputAnswers": [
        { "label": "H2O", "text": "The chemical formula of water is H2O because each molecule contains two hydrogen atoms and one oxygen atom. That simple structure explains why water behaves the way it does in nature." },
        { "label": "NaCl", "text": "NaCl is the formula for table salt, not water, even though it is one of the most familiar chemical formulas in everyday life. It is a completely different compound with a very different structure." },
        { "label": "CO2", "text": "CO2 is the formula for carbon dioxide, which is a gas released by burning fuel and by respiration. It is important in climate science, but it is not the formula for water." },
        { "label": "Asking", "text": "An asking frame targets the explicit desire to retrieve concrete factual data from a set of known scientific constants." },
        { "label": "Requesting", "text": "Requesting represents a direct appeal for a formal descriptor, seeking the precise arrangement of elemental symbols." },
        { "label": "Wondering", "text": "Wondering highlights an open-ended, inquisitive mindset exploring the foundational molecular breakdown of everyday matter." },
        { "label": "Meaning", "text": "Meaning probes the deeper significance behind chemical shorthand, translating abstract letters into tangible physical realities." },
        { "label": "Purpose", "text": "Purpose evaluates why a specific shorthand notation is utilized globally to standardize the communication of molecular units." },
        { "label": "Nature", "text": "Nature emphasizes the intrinsic physical and chemical characteristics that define the identity of the fluid compound." },
        { "label": "Name", "text": "Name acts as the formal linguistic marker used to classify chemical entities in both standard nomenclature and common speech." },
        { "label": "Type", "text": "Type classifies the substance within systemic boundaries, categorizing it relative to other volatile or stable configurations." },
        { "label": "Category", "text": "Category positions the target within an organized taxonomic matrix, separating basic oxides from complex organic compounds." },
        { "label": "State of being", "text": "State of being establishes the current operational existence of the relationship, grounding it as a universal scientific constant." },
        { "label": "Existence", "text": "Existence confirms the ontological presence of the chemical link, affirming that the formula accurately mirrors a physical compound." },
        { "label": "Identity", "text": "Identity isolates the unique signature of the target molecule, distinguishing its core notation from all alternative formulas." },
        { "label": "Linking", "text": "Linking acts as the syntactic bridge that seamlessly connects the subject name to its corresponding symbolic notation." },
        { "label": "Describing", "text": "Describing details the characteristics of the object, expanding the raw symbols into a narrative of bonds and behaviors." },
        { "label": "Equating", "text": "Equating establishes an absolute parity between the common term and its rigorous molecular representation." },
        { "label": "Present tense", "text": "Present tense locks the query into an enduring truth, reflecting laws of chemistry that remain static across time." },
        { "label": "Progressive", "text": "Progressive frameworks emphasize ongoing actions, though less common when defining static chemical formulas." },
        { "label": "Passive", "text": "Passive structures invert agency, shifting focus onto the object being defined rather than the agent doing the defining." },
        { "label": "Definite", "text": "Definite markers indicate the user is searching for a singular, universally accepted notation rather than a tentative guess." },
        { "label": "Specific", "text": "Specific focus drills directly down into the isolated chemical makeup of a single compound, ignoring surrounding variables." },
        { "label": "General", "text": "General concepts reference broad categories of fluids, serving as the contextual backdrop before focusing on one entity." },
        { "label": "Pointing", "text": "Pointing directs the linguistic focus sharply toward the noun phrase, serving as a signpost for the main technical query." },
        { "label": "Referring", "text": "Referring links the structural question to an exact node in the user's mental map of basic physical sciences." },
        { "label": "Identifying", "text": "Identifying extracts a singular designation from a wider vocabulary, ensuring exact alignment between word and symbol." },
        { "label": "English", "text": "English parameters establish the linguistic syntax and structural rules through which the chemical query is communicated." },
        { "label": "Grammar", "text": "Grammar dictates the arrangement of interrogatives and nouns, allowing the system to accurately parse the informational goal." },
        { "label": "Linguistics", "text": "Linguistics evaluates how the structural semantics of the sentence reveal the underlying intent of the questioner." },
        { "label": "Structure", "text": "Structure examines the geometric and physical layout of the atomic components, detailing how they align in physical space." },
        { "label": "Bonding", "text": "Bonding analyzes the sharing of valence electrons that holds the constituent atoms tightly together in a stable unit." },
        { "label": "Properties", "text": "Properties detail the macroscopic behaviors, such as boiling points and surface tension, stemming from microscopic configurations." },
        { "label": "Elements", "text": "Elements represent the pure substances found on the periodic table that combine to construct more complex matter." },
        { "label": "Compounds", "text": "Compounds define substances formed by the chemical union of two or more distinct elements in fixed, definite proportions." },
        { "label": "Mixtures", "text": "Mixtures involve physically combined substances that retain their individual properties, unlike pure chemical compounds." },
        { "label": "Symbolic", "text": "Symbolic representations compress complex atomic descriptions into highly scannable, standardized alphanumeric shorthand." },
        { "label": "Written", "text": "Written text preserves the formal chemical notation in a readable medium, serving as a blueprint for global science." },
        { "label": "Standard", "text": "Standard convention ensures that scientists worldwide recognize the exact same shorthand without regional ambiguity." },
        { "label": "Balanced", "text": "Balanced proportions ensure the notation perfectly accounts for charge neutrality and stoichiometry within the molecule." },
        { "label": "Chemical", "text": "Chemical focus isolates reactions, molecular formulas, and atomic properties over purely macro-physical attributes." },
        { "label": "Molecular", "text": "Molecular scale shifts attention away from standalone atoms to examine discrete clusters of covalently bound particles." },
        { "label": "Scientific", "text": "Scientific methodology grounds the query within empirical framework parameters, removing casual or poetic definitions." },
        { "label": "Mathematical", "text": "Mathematical logic governs the integer ratios used as subscripts to count the exact number of atoms present." },
        { "label": "Technical", "text": "Technical framing ensures the vocabulary meets formal engineering and laboratory standards rather than casual slang." },
        { "label": "Part of", "text": "Part of defines the fractional relationship, highlighting individual elements that construct the larger substance." },
        { "label": "Belonging", "text": "Belonging tracks properties or atomic components that are inherently tied to the identity of the specific compound." },
        { "label": "Origin", "text": "Origin traces the derivation of the formula back to empirical mass percentage discoveries in early laboratory trials." },
        { "label": "Ownership", "text": "Ownership maps systemic traits that belong exclusively to this particular arrangement of molecules." },
        { "label": "Association", "text": "Association connects auxiliary concepts, like state changes or solvent capabilities, back to the core compound." },
        { "label": "Connection", "text": "Connection establishes the molecular interface linking distinct atomic masses into a singular cohesive entity." },
        { "label": "Made from", "text": "Made from explicitly lists the basic raw chemical elements required to synthesis the target fluid compound." },
        { "label": "Containing", "text": "Containing audits the interior inventory of the molecule, verifying which atoms are present inside the outer shell." },
        { "label": "Material", "text": "Material context examines the physical mass and tactile density of the substance when gathered in visible volume." },
        { "label": "H2O2", "text": "H2O2 represents hydrogen peroxide, a highly reactive compound containing an extra oxygen atom compared to standard water." },
        { "label": "H3O", "text": "H3O represents the hydronium ion, which forms when a water molecule gains a proton, serving as a key indicator of acidity." },
        { "label": "Two hydrogen", "text": "Two hydrogen atoms are required for every single unit of the compound, providing the essential light masses of the system." },
        { "label": "One oxygen", "text": "One oxygen atom forms the highly electronegative center of the molecule, pulling the shared electrons closer to itself." },
        { "label": "Polar", "text": "Polar orientation creates an uneven distribution of electrical charge, giving one side a partial negative value." },
        { "label": "Universal solvent", "text": "The universal solvent moniker highlights the fluid's unmatched ability to dissolve a vast array of polar molecules." },
        { "label": "Polar molecule", "text": "A polar molecule possesses a distinct dipole moment due to asymmetrical shape and differences in atomic electronegativity." },
        { "label": "Amphoteric", "text": "Amphoteric substances can react chemically as both an acid or a base depending on the nature of the co-reactants." }
      ],
      "answer": "The chemical formula of water is H2O, which means each water molecule consists of two hydrogen atoms covalently bonded to a single oxygen atom.\n\nWater is a polar molecule with unique properties: it is liquid at room temperature, has high surface tension, expands when freezing, and is called the 'universal solvent'."
    },
    {
      "id": 5,
      "prompt": "What is the capital city of Japan?",
      "keywords": ["what", "is", "the", "capital", "city", "of", "Japan"],
      "analysis": { "topic": "Japanese geography", "intent": "Find the capital city of Japan", "language": "English" },
      "layers": [
        SharedLayers.what,
        SharedLayers.is,
        SharedLayers.the,
        {
          "word": "capital",
          "options": [
            { "text": "Location", "prob": 50, "next": ["Tokyo 80%", "Kyoto 15%", "Osaka 5%"] },
            { "text": "Government", "prob": 30, "next": ["Seat of power 65%", "Administration 25%", "Politics 10%"] },
            { "text": "Finance", "prob": 20, "next": ["Investment 55%", "Banking 35%", "Economy 10%"] }
          ]
        },
        {
          "word": "city",
          "options": [
            { "text": "Urban area", "prob": 50, "next": ["Tokyo 70%", "Osaka 20%", "Nagoya 10%"] },
            { "text": "Metropolis", "prob": 30, "next": ["Largest 60%", "Oldest 25%", "Famous 15%"] },
            { "text": "Place", "prob": 20, "next": ["Historical 55%", "Modern 35%", "Traditional 10%"] }
          ]
        },
        SharedLayers.of,
        {
          "word": "Japan",
          "options": [
            { "text": "Country", "prob": 50, "next": ["Tokyo 80%", "Kyoto 15%", "Osaka 5%"] },
            { "text": "Culture", "prob": 30, "next": ["Traditional 55%", "Modern 35%", "Mix 10%"] },
            { "text": "Geography", "prob": 20, "next": ["Archipelago 60%", "Mountainous 25%", "Coastal 15%"] }
          ]
        }
      ],
      "outputAnswers": [
        { "label": "Tokyo", "text": "Tokyo is the capital of Japan and one of the world's most influential metropolitan centers. It is a major hub for government, technology, culture, and finance." },
        { "label": "Kyoto", "text": "Kyoto is a historic Japanese city known for temples, gardens, and traditional culture. It is famous for its preserved heritage and elegant old neighborhoods." },
        { "label": "Osaka", "text": "Osaka is a vibrant Japanese city known for its food, nightlife, and energetic urban atmosphere. It is one of the country's most dynamic places to live and visit." },
        { "label": "Asking", "text": "An asking frame signals an interrogative intent to pull confirmed geographic metadata directly from a verified world atlas dataset." },
        { "label": "Requesting", "text": "Requesting represents a formal inquiry for a specific proper noun, pinpointing the precise location of a sovereign territory's primary administrative city." },
        { "label": "Wondering", "text": "Wondering highlights a curious exploration of global networks, tracking how major political centers are distributed across East Asia." },
        { "label": "Meaning", "text": "Meaning examines the systemic definition of what constitutes a primary municipality within the national infrastructure framework." },
        { "label": "Purpose", "text": "Purpose establishes why a nation consolidates its executive branch and parliamentary assemblies within one centralized urban jurisdiction." },
        { "label": "Nature", "text": "Nature describes the organic development, cultural density, and physical landscape traits that define a major metropolis." },
        { "label": "Name", "text": "Name serves as the official toponymic designation used to identity and label the primary city in global diplomatic registries." },
        { "label": "Type", "text": "Type classifies the target settlement by function, distinguishing a prime global city from secondary commercial ports." },
        { "label": "Category", "text": "Category organizes the city into structural groups based on criteria like administrative tier, overall population, and global output." },
        { "label": "State of being", "text": "State of being registers the current status of the political layout, confirming the arrangement as an active geopolitical reality." },
        { "label": "Existence", "text": "Existence validates the concrete, ongoing operational reality of the metropolis as a major node in the global economy." },
        { "label": "Identity", "text": "Identity establishes the unique cultural signature and history that separates this urban center from other massive cities." },
        { "label": "Linking", "text": "Linking provides the necessary grammatical copula to bind the generic noun of the office directly to the specific city's name." },
        { "label": "Describing", "text": "Describing expands the simple target answer into a richer narrative about urban layout, demographics, and cultural impact." },
        { "label": "Equating", "text": "Equating asserts an exact, absolute definition matching the title of the administrative center to its geographical entity." },
        { "label": "Present tense", "text": "Present tense emphasizes that the political arrangement represents the current modern baseline, regardless of where past courts sat." },
        { "label": "Progressive", "text": "Progressive parameters tracking ongoing urban sprawl, development shifts, and construction cycles across the wider bay area." },
        { "label": "Passive", "text": "Passive framing places focus squarely on the city itself as the object being located, minimizing the focus on the speaker." },
        { "label": "Definite", "text": "Definite articles show that the user expects a singular, non-ambiguous answer representing the sole designated capital city." },
        { "label": "Specific", "text": "Specific parameters narrow down the systemic search, excluding general Japanese prefectures to zero in on a single node." },
        { "label": "General", "text": "General frameworks treat the area broadly as part of the wider East Asian monsoon region before applying precise geographic filters." },
        { "label": "Pointing", "text": "Pointing highlights the syntactic direction of the question, guiding the search pipeline toward an exact point on a map." },
        { "label": "Referring", "text": "Referring links the abstract political concept in the query to a real-world city built out of steel, stone, and historic concrete." },
        { "label": "Identifying", "text": "Identifying serves to confirm that the proper noun group matches the exact target record stored within the geographic database." },
        { "label": "English", "text": "English parameters regulate the syntax, spelling variants, and standard word selections used to frame the global geographic prompt." },
        { "label": "Grammar", "text": "Grammar dictates the standard structural layout of the interrogative sentence, ensuring it can be parsed correctly by processing engines." },
        { "label": "Linguistics", "text": "Linguistics studies how the query words establish semantic meaning, tracking how abstract tokens prompt specific geographic facts." },
        { "label": "Seat of power", "text": "Seat of power frames the question around the permanent location of the national diet, the prime minister's office, and the imperial palace." },
        { "label": "Administration", "text": "Administration highlights the logistical headquarters of state ministries, managing public services across all prefectures." },
        { "label": "Politics", "text": "Politics focuses on the hub where legislation is enacted, embassies are hosted, and national policies are debated." },
        { "label": "Investment", "text": "Investment tracks the immense flow of capital concentrated within the central financial districts, corporate headquarters, and stock exchanges." },
        { "label": "Banking", "text": "Banking refers to the central regulatory financial clearing houses and massive international banking firms anchored in the city." },
        { "label": "Economy", "text": "Economy relates to the massive gross metropolitan product generated by commerce, manufacturing, and technical industries." },
        { "label": "Nagoya", "text": "Nagoya represents a crucial industrial and manufacturing core city in central Japan, famous for aerospace and automotive tech." },
        { "label": "Largest", "text": "Largest highlights the unparalleled scale of the urban zone, which stands as the most populous metropolitan cluster on Earth." },
        { "label": "Oldest", "text": "Oldest tracks the deep historical heritage of ancient regional centers, tracing lineage back through centuries of classical eras." },
        { "label": "Famous", "text": "Famous elements emphasize global recognition, calling up world-renowned landmarks, fashion sectors, and pop culture hubs." },
        { "label": "Historical", "text": "Historical parameters trace the long evolution from a minor medieval fortress town to the massive center of the Tokugawa Shogunate." },
        { "label": "Modern", "text": "Modern aspects highlight the neon skyscrapers, cutting-edge train networks, and hyper-dense infrastructure that dominate today's skyline." },
        { "label": "Traditional", "text": "Traditional themes uncover the deep-rooted shrines, formal tea houses, and seasonal festivals that survive alongside high-tech living." },
        { "label": "Part of", "text": "Part of defines the regional layout, showing how the specific city coordinates relate to the larger national mainland." },
        { "label": "Belonging", "text": "Belonging marks the structural inclusion of the metropolitan zone under the direct sovereign jurisdiction of the country." },
        { "label": "Origin", "text": "Origin traces the geological and cultural beginnings of the regional settlement from early maritime paths onward." },
        { "label": "Ownership", "text": "Ownership relates to public land use, administrative control, and territorial borders managed by the national government." },
        { "label": "Association", "text": "Association connects the geographical name to global cultural phenomena, ranging from culinary arts to high-tech innovations." },
        { "label": "Connection", "text": "Connection charts the dense transit lines, high-speed rail links, and oceanic shipping routes tying the center to the globe." },
        { "label": "Made from", "text": "Made from details the physical building blocks of the urban sprawl, from reclamation soil projects to reinforced earthquake structures." },
        { "label": "Containing", "text": "Containing lists the distinct inner wards, commercial avenues, and green spaces bounded inside the official urban lines." },
        { "label": "Material", "text": "Material conditions observe physical topography, local weather patterns, and resource logistics required to keep the city running." },
        { "label": "Mix", "text": "Mix describes the dense blend of historic architecture and high-tech structures that create the unique aesthetic of the metropolis." },
        { "label": "Archipelago", "text": "Archipelago refers to the volcanic island chain configuration that shapes the entire geographic framework of the home country." },
        { "label": "Mountainous", "text": "Mountainous topography defines the mainland terrain, forcing urban populations to pack tightly into coastal plains." },
        { "label": "Coastal", "text": "Coastal placement highlights the plain location along a massive natural bay, which historically powered sea trading paths." }
      ],
      "answer": "The capital city of Japan is Tokyo. Originally a small fishing village called Edo, it became the de facto capital in 1603.\n\nTokyo is one of the world's most populous metropolitan areas, with over 37 million residents in the Greater Tokyo Area."
    },
    {
      "id": 6,
      "prompt": "Explain the process of photosynthesis.",
      "keywords": ["explain", "the", "process", "of", "photosynthesis"],
      "analysis": { "topic": "Photosynthesis in plants", "intent": "Understand how photosynthesis works", "language": "English" },
      "layers": [
        SharedLayers.explain,
        SharedLayers.the,
        {
          "word": "process",
          "options": [
            { "text": "Mechanism", "prob": 50, "next": ["Light energy 60%", "CO2 fixation 30%", "Water splitting 10%"] },
            { "text": "Steps", "prob": 30, "next": ["Chlorophyll absorption 55%", "Glucose production 35%", "Oxygen release 10%"] },
            { "text": "System", "prob": 20, "next": ["Natural 65%", "Efficient 25%", "Complex 10%"] }
          ]
        },
        SharedLayers.of,
        {
          "word": "photosynthesis",
          "options": [
            { "text": "Energy conversion", "prob": 55, "next": ["Light to chemical 70%", "Solar to glucose 25%", "Photons to energy 5%"] },
            { "text": "Plant biology", "prob": 30, "next": ["Chloroplasts 55%", "Chlorophyll 35%", "Leaves 10%"] },
            { "text": "Carbon cycle", "prob": 15, "next": ["CO2 fixation 60%", "Oxygen release 30%", "Sugar production 10%"] }
          ]
        }
      ],
      "outputAnswers": [
        { "label": "Light energy", "text": "Photosynthesis begins when plants absorb light energy from the sun and use it to power the conversion of carbon dioxide and water into sugars. This is the first major step in making food for the plant." },
        { "label": "CO2 fixation", "text": "CO2 fixation is a core part of photosynthesis because plants use carbon dioxide from the air to build glucose. It is one of the key chemical reactions that makes plant growth possible." },
        { "label": "Water splitting", "text": "Water splitting happens during photosynthesis when light energy helps break water molecules apart. This releases oxygen and provides the electrons needed for the process to continue." },
        { "label": "Overview", "text": "An overview of photosynthesis describes it as the foundational biological process that converts solar energy into chemical energy, sustaining nearly all life on Earth." },
        { "label": "Detailed", "text": "A detailed look at photosynthesis breaks down the process into the light-dependent reactions in the thylakoid membranes and the light-independent Calvin cycle in the stroma." },
        { "label": "Briefly", "text": "Briefly, photosynthesis is how plants use sunlight, water, and carbon dioxide to create their own food while releasing oxygen into the atmosphere." },
        { "label": "Purpose", "text": "The primary purpose of photosynthesis is to synthesize carbohydrates that fuel plant metabolism and serve as the base of the global food web." },
        { "label": "Process", "text": "The process involves an intricate series of electron transport chains, chemical reduction steps, and enzymatic reactions working in harmony within plant cells." },
        { "label": "Context", "text": "In a broader environmental context, photosynthesis drives the global carbon cycle, regulating atmospheric composition and countering the greenhouse effect." },
        { "label": "With examples", "text": "With examples ranging from terrestrial oak trees to aquatic green algae and cyanobacteria, photosynthesis occurs across diverse autotrophic organisms." },
        { "label": "Theoretically", "text": "Theoretically, the maximum quantum efficiency of photosynthesis is bounded by the physics of photon absorption and the thermodynamic limits of the Calvin cycle." },
        { "label": "Definite", "text": "Definite cellular structures, known as chloroplasts, contain the specialized machinery required to capture incoming photons without losing energy to heat." },
        { "label": "Specific", "text": "Specific variations of the process, such as C4 and CAM pathways, allow certain plants to efficiently fix carbon in hot, arid environments." },
        { "label": "General", "text": "In general terms, photosynthesis can be understood as nature's original solar panel, converting raw environmental elements into stable organic matter." },
        { "label": "Pointing", "text": "Pointing out the key inputs highlights that without a steady supply of soil water and atmospheric carbon dioxide, the production cycle grinds to a halt." },
        { "label": "Referring", "text": "Referring to the primary light-harvesting complexes underscores how protein networks position pigment molecules perfectly to trap incoming sunlight." },
        { "label": "Identifying", "text": "Identifying the limiting factors of the reaction—such as light intensity, temperature, and carbon dioxide levels—helps predict agricultural crop yields." },
        { "label": "English", "text": "The English term 'photosynthesis' combines the Greek roots for 'light' and 'putting together', perfectly describing the chemical construction process." },
        { "label": "Grammar", "text": "The chemical grammar of the reaction balance ensures that for every six molecules of carbon dioxide taken in, six molecules of oxygen are released." },
        { "label": "Linguistics", "text": "Linguistics aside, scientific terminology often groups the light reactions and dark reactions to easily distinguish where light is directly required." },
        { "label": "Chlorophyll absorption", "text": "Chlorophyll absorption spikes in the blue and red wavelengths of the spectrum, reflecting green light and giving vegetation its characteristic color." },
        { "label": "Glucose production", "text": "Glucose production provides the essential building blocks for cellulose, which forms cell walls, and starch, which stores energy for later use." },
        { "label": "Oxygen release", "text": "Oxygen release is a fortunate byproduct of water splitting, completely transforming the prehistoric atmosphere and enabling aerobic life to evolve." },
        { "label": "Natural", "text": "This natural phenomenon has operated for billions of years, creating the fossil fuels we use today from ancient, decayed organic matter." },
        { "label": "Efficient", "text": "An efficient transfer of energy occurs during the initial photoexcitation steps, moving excitons to the reaction center with near-perfect quantum efficiency." },
        { "label": "Complex", "text": "The complex nature of Rubisco, the main enzyme responsible for fixing carbon, makes it one of the most abundant yet notoriously slow enzymes on Earth." },
        { "label": "Part of", "text": "As a critical part of plant physiology, the rate of photosynthesis directly dictates how fast a seedling can grow and establish a root system." },
        { "label": "Belonging", "text": "Belonging to the class of anabolic pathways, this process requires an investment of cellular energy to construct larger, more complex molecules." },
        { "label": "Origin", "text": "The evolutionary origin of modern chloroplasts points back to endosymbiosis, where an ancient eukaryotic cell engulfed a photosynthetic cyanobacterium." },
        { "label": "Ownership", "text": "Plant ownership of these specialized organelles gives them a distinct ecological advantage, allowing them to thrive without hunting for organic food." },
        { "label": "Association", "text": "The strong association between sunlight availability and stomatal opening ensures that gas exchange happens when solar energy is highest." },
        { "label": "Connection", "text": "The connection between the light reactions and the Calvin cycle is maintained by two crucial energy carriers: ATP and NADPH molecules." },
        { "label": "Made from", "text": "Made from simple, inorganic raw materials, the resulting sugars represent a massive upgrade in structural complexity and chemical potential energy." },
        { "label": "Containing", "text": "Containing thousands of individual thylakoid disks arranged in stacks called grana, a single plant cell maximizes its light-catching surface area." },
        { "label": "Material", "text": "The material properties of leaves, including their broad surface area and thin profiles, are optimized to capture photons and facilitate gas diffusion." },
        { "label": "Light to chemical", "text": "The conversion of light to chemical energy represents the foundational bridge between the physical physics of the sun and the biology of living organisms." },
        { "label": "Solar to glucose", "text": "This solar to glucose pipeline secures the necessary calories to sustain not only the plant itself, but every herbivore and carnivore down the line." },
        { "label": "Photons to energy", "text": "Translating photons to energy involves knocking an electron loose from chlorophyll, starting a molecular bucket brigade down the transport chain." },
        { "label": "Chloroplasts", "text": "Chloroplasts act as the microscopic cellular factories where all components of the photosynthetic engine are housed and operated." },
        { "label": "Chlorophyll", "text": "Chlorophyll is the principal pigment molecule embedded inside the membrane, acting as the primary antenna that intercepts incoming light." },
        { "label": "Leaves", "text": "Leaves are the specialized, highly evolved evolutionary organs designed specifically to serve as the primary site of photosynthetic activity." },
        { "label": "Sugar production", "text": "Ultimately, sugar production represents the successful culmination of the entire cycle, yielding the energy units that power the biosphere." }
      ],
      "answer": "Photosynthesis is the process by which green plants convert light energy into chemical energy stored in glucose.\n\nThe chemical equation is: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2. During the light-dependent reactions, chlorophyll absorbs sunlight and splits water molecules, releasing oxygen."
    },
    {
      "id": 7,
      "prompt": "What is the speed of light in vacuum?",
      "keywords": ["what", "is", "the", "speed", "of", "light", "in", "vacuum"],
      "analysis": { "topic": "Speed of light constant", "intent": "Determine the exact speed of light", "language": "English" },
      "layers": [
        SharedLayers.what,
        SharedLayers.is,
        SharedLayers.the,
        {
          "word": "speed",
          "options": [
            { "text": "Velocity", "prob": 50, "next": ["299792458 m/s 90%", "300000 km/s 8%", "186000 mi/s 2%"] },
            { "text": "Measurement", "prob": 30, "next": ["Exact value 65%", "Approximate 25%", "Range 10%"] },
            { "text": "Constant", "prob": 20, "next": ["Physical law 60%", "Universal 30%", "Fundamental 10%"] }
          ]
        },
        SharedLayers.of,
        {
          "word": "light",
          "options": [
            { "text": "Electromagnetic", "prob": 50, "next": ["Visible spectrum 60%", "Photons 30%", "Waves 10%"] },
            { "text": "Radiation", "prob": 30, "next": ["Speed of propagation 65%", "Frequency 25%", "Intensity 10%"] },
            { "text": "Energy", "prob": 20, "next": ["Particle nature 55%", "Wave nature 35%", "Both 10%"] }
          ]
        },
        {
          "word": "in",
          "options": [
            { "text": "Preposition", "prob": 50, "next": ["Location 60%", "Condition 25%", "Context 15%"] },
            { "text": "Medium", "prob": 30, "next": ["Vacuum 55%", "Water 35%", "Air 10%"] },
            { "text": "Environment", "prob": 20, "next": ["Space 65%", "Laboratory 25%", "Natural 10%"] }
          ]
        },
        {
          "word": "vacuum",
          "options": [
            { "text": "Empty space", "prob": 50, "next": ["299792458 m/s 90%", "300000 km/s 8%", "186000 mi/s 2%"] },
            { "text": "No medium", "prob": 30, "next": ["Absolute 60%", "Near-perfect 30%", "Partial 10%"] },
            { "text": "Pure environment", "prob": 20, "next": ["Controlled 65%", "Ideal 25%", "Natural 10%"] }
          ]
        }
      ],
      "outputAnswers": [
        { "label": "299792458 m/s", "text": "The speed of light in a vacuum is exactly 299,792,458 meters per second, which is the official physical constant used in science. It is the fastest speed anything in the universe can travel." },
        { "label": "300000 km/s", "text": "The speed of light is approximately 300,000 kilometers per second, which is the rounded value often used in classrooms and simple calculations. It is a convenient way to talk about an extremely fast constant." },
        { "label": "186000 mi/s", "text": "The speed of light is about 186,000 miles per second, which is the imperial-unit way of expressing a universal physical limit. It is a striking number because it is so large." },
        { "label": "Asking", "text": "An asking posture usually triggers a direct query for fundamental cosmological metrics, pulling the precise speed from established physical data arrays." },
        { "label": "Requesting", "text": "Requesting details on universal limits shifts the processing lens toward the exact units—whether metric or imperial—needed to complete a calculation." },
        { "label": "Wondering", "text": "Wondering about the upper velocity bounds of the universe leads into a conceptual exploration of why a physical constant holds its precise value." },
        { "label": "Meaning", "text": "The operational meaning of this constant represents more than just speed; it serves as the foundational scaling factor linking space and time together." },
        { "label": "Purpose", "text": "Its core purpose in relativistic equations is to establish causality, ensuring that an effect can never happen before its originating cause." },
        { "label": "Nature", "text": "The physical nature of light dictates that its speed remains entirely independent of the motion of the source or the relative observer." },
        { "label": "Name", "text": "Formally assigned the variable name 'c' in physics, the designation stems from the Latin 'celeritas', which translates directly to swiftness." },
        { "label": "Type", "text": "As a specific type of cosmic speed limit, it governs the motion of all massless particles, including gluons and gravitational waves." },
        { "label": "Category", "text": "It fits into the category of fundamental physical constants, alongside Planck's constant and the universal gravitational constant." },
        { "label": "State of being", "text": "In its baseline state of being, light requires no physical medium to travel through, allowing it to cross vast intergalactic distances." },
        { "label": "Existence", "text": "Its stable existence anchors our modern measurement systems, as the physical length of a standard meter is defined by how far light travels in a tiny fraction of a second." },
        { "label": "Identity", "text": "The unique identity of this constant ensures that it preserves its exact value across all regions of space and every epoch of cosmic time." },
        { "label": "Linking", "text": "Linking mass and energy directly together, this value becomes the heavily magnified conversion multiplier in the famous equation E=mc squared." },
        { "label": "Describing", "text": "Describing how light behaves at this boundary reveals that for an object traveling at 'c', local time slows down to a complete standstill." },
        { "label": "Equating", "text": "Equating this velocity to a maximum threshold means that accelerating any object with rest mass to this speed would require an infinite amount of energy." },
        { "label": "Present tense", "text": "In the present tense of modern cosmology, we observe light that left distant stars billions of years ago still arriving at this exact same velocity." },
        { "label": "Progressive", "text": "A progressive shift in historical measurements tracked this number down from rough astronomical guesses to laser-precise laboratory confirmations." },
        { "label": "Passive", "text": "When light is passed through dense matter, its overall velocity is reduced via absorption and re-emission interactions with surrounding atoms." },
        { "label": "Definite", "text": "The definite nature of this limit ensures that nothing carrying actual physical data can skip across space faster than the constant allows." },
        { "label": "Specific", "text": "Specific engineering constraints in fiber-optic communications are dictated by this rate, introducing a tiny, unavoidable lag over global distances." },
        { "label": "General", "text": "In general terms, if you could travel at this speed, you could orbit the Earth's equator approximately 7.5 times in a single second." },
        { "label": "Pointing", "text": "Pointing out the vast scale of space, even at this extreme speed it still takes over four years for light to reach us from the nearest star system." },
        { "label": "Referring", "text": "Referring to the standard cosmic horizon emphasizes that because of this speed limit, looking out into deep space is exactly like looking back in time." },
        { "label": "Identifying", "text": "Identifying variations in how light propagates through different materials requires calculating the specific refractive index of that substance." },
        { "label": "English", "text": "The English phrase 'speed of light' is sometimes swapped for 'velocity of light', though technically velocity requires a specific travel direction." },
        { "label": "Grammar", "text": "The mathematical grammar of physics relies on this value to keep dimensional analysis uniform across quantum and relativistic frameworks." },
        { "label": "Linguistics", "text": "Linguistics often uses terms like 'lightning fast' or 'warp speed', but neither matches the rigid physical reality defined by this constant." },
        { "label": "Exact value", "text": "The exact value was officially frozen in 1983, when scientists decided to redefine the meter itself around the constant speed of light." },
        { "label": "Approximate", "text": "An approximate value is perfectly adequate for back-of-the-envelope calculations, where rounding to three times ten to the eighth meters per second saves time." },
        { "label": "Range", "text": "While the speed in a vacuum never alters, the effective speed across a range of different gases and liquids fluctuates based on density." },
        { "label": "Physical law", "text": "Special relativity functions as the core physical law that sets this barrier as an absolute threshold for everything in the universe." },
        { "label": "Universal", "text": "This universal benchmark applies everywhere, ensuring that physics operates under identical constraints whether in a local room or a distant galaxy." },
        { "label": "Fundamental", "text": "At a fundamental level, the speed is determined by the raw electromagnetic properties of empty space: permeability and permittivity." },
        { "label": "Part of", "text": "As a central part of astrophysics, knowing this speed allows us to convert the travel time of stellar signals directly into accurate distances." },
        { "label": "Belonging", "text": "Belonging to the elite group of invariant constants, it does not stretch, compress, or morph when you change your frame of reference." },
        { "label": "Origin", "text": "The origin of our accurate modern values stems from early experiments bouncing light beams off distant mirrors across Paris hillsides." },
        { "label": "Ownership", "text": "Vacuum space has total ownership over the maximum value; any interference from physical matter automatically degrades the speed." },
        { "label": "Association", "text": "The close association between this speed and gravitational waves was beautifully confirmed when both signals from a star collision arrived at Earth simultaneously." },
        { "label": "Connection", "text": "The close connection between frequency and wavelength means that if one shifts, the other adjusts instantly to keep the speed of light stable." },
        { "label": "Made from", "text": "Though light is made from alternating electric and magnetic fields, its speed remains constant regardless of the light's color or total energy." },
        { "label": "Containing", "text": "Containing zero rest mass allows the photon to jump to full speed the exact instant it is created, with no gradual acceleration phase." },
        { "label": "Material", "text": "When striking a material barrier like glass, the photons appear to slow down because they are busy interacting with the medium's internal structures." },
        { "label": "Visible spectrum", "text": "Every color within the visible spectrum travels at the exact same uniform speed through empty space, arriving at our eyes in perfect sync." },
        { "label": "Photons", "text": "Individual photons act as the discrete quantum packets that transport electromagnetic energy through space at this baseline velocity." },
        { "label": "Waves", "text": "As continuous waves, electromagnetic ripples spread out from an oscillating charge source, tracking perfectly along this speed baseline." },
        { "label": "Speed of propagation", "text": "The speed of propagation slows down significantly when light enters a diamond, dropping to roughly forty percent of its vacuum maximum." },
        { "label": "Frequency", "text": "Whether a wave possesses a low radio frequency or an intense gamma-ray frequency, its speed through a vacuum remains completely unchanged." },
        { "label": "Intensity", "text": "Varying the intensity of a laser changes how many photons are packed into the beam, but it will not add a single meter per second to their speed." },
        { "label": "Particle nature", "text": "The particle nature of light is demonstrated when individual photons kick electrons free from metals, moving at full speed prior to impact." },
        { "label": "Wave nature", "text": "The wave nature of light causes it to bend around tight obstacles, maintaining its propagation rate while creating complex interference patterns." },
        { "label": "Both", "text": "Exhibiting traits of both models, light travels as a probability wave while transferring energy at a single point upon arrival." },
        { "label": "Location", "text": "No matter your specific location in the cosmos, setting up an experiment to measure this value will always yield the exact same numeric result." },
        { "label": "Condition", "text": "The essential condition for measuring the absolute maximum speed requires a space completely emptied of all gas molecules and dust particles." },
        { "label": "Context", "text": "In the context of computer engineering, this speed determines the physical limits of processor design, as signals can only travel so fast across a chip." },
        { "label": "Vacuum", "text": "A perfect vacuum represents the only environment where light can travel unhindered at its absolute, uncompromised maximum velocity." },
        { "label": "Water", "text": "Traveling through water drags the speed down to roughly 225,000 kilometers per second, causing the light path to bend via refraction." },
        { "label": "Air", "text": "Air offers very little resistance, slowing the beam down by a tiny fraction of a percent compared to a completely empty environment." },
        { "label": "Space", "text": "The vast emptiness of deep space serves as an excellent natural arena for light to maintain its maximum velocity across billions of light-years." },
        { "label": "Laboratory", "text": "Inside a modern laboratory, physicists use ultra-cold atomic vapors to slow light down to a literal crawl, capturing its energy temporarily." },
        { "label": "Natural", "text": "This natural speed barrier dictates the scale of our universe, forming a Horizon past which we cannot observe because light simply hasn't reached us yet." },
        { "label": "Absolute", "text": "As an absolute ceiling, it splits reality into regions that can casually affect each other and regions that remain permanently isolated." },
        { "label": "Near-perfect", "text": "Achieving a near-perfect vacuum inside experimental pipelines allows scientists to verify relativity equations with unprecedented precision." },
        { "label": "Partial", "text": "A partial blockage or medium swap will drop the phase velocity of the wave while leaving the underlying fundamental constant intact." },
        { "label": "Controlled", "text": "Using a highly controlled environment ensures that external magnetic fluctuations do not disrupt the delicate timing mechanisms used to track the beam." },
        { "label": "Ideal", "text": "Under ideal theoretical conditions, this value represents the ultimate speed at which gravity updates the orbital paths of planets across the solar system." }
      ],
      "answer": "The speed of light in a vacuum is exactly 299,792,458 meters per second (approximately 300,000 km/s or 186,282 miles per second).\n\nAccording to Einstein's theory of special relativity, this is the maximum speed at which all energy, matter, and information can travel."
    },
    {
      "id": 8,
      "prompt": "What is the largest ocean on Earth?",
      "keywords": ["what", "is", "the", "largest", "ocean", "on", "Earth"],
      "analysis": { "topic": "World oceans", "intent": "Identify the largest ocean on Earth", "language": "English" },
      "layers": [
        SharedLayers.what,
        SharedLayers.is,
        SharedLayers.the,
        {
          "word": "largest",
          "options": [
            { "text": "Size", "prob": 50, "next": ["Pacific 80%", "Atlantic 15%", "Indian 5%"] },
            { "text": "Rank", "prob": 30, "next": ["Number one 65%", "Biggest 25%", "Greatest 10%"] },
            { "text": "Comparison", "prob": 20, "next": ["Vs Atlantic 55%", "Vs Indian 35%", "Vs Arctic 10%"] }
          ]
        },
        {
          "word": "ocean",
          "options": [
            { "text": "Water body", "prob": 50, "next": ["Pacific 75%", "Atlantic 15%", "Indian 10%"] },
            { "text": "Geography", "prob": 30, "next": ["Major oceans 55%", "Ocean floor 35%", "Currents 10%"] },
            { "text": "Ecosystem", "prob": 20, "next": ["Marine life 60%", "Coral reefs 25%", "Deep ocean 15%"] }
          ]
        },
        {
          "word": "on",
          "options": [
            { "text": "Preposition", "prob": 50, "next": ["Location 60%", "Surface 25%", "Above 15%"] },
            { "text": "Position", "prob": 30, "next": ["Geographic 55%", "Spatial 35%", "Relative 10%"] },
            { "text": "Contact", "prob": 20, "next": ["Sitting on 65%", "Resting on 25%", "Floating on 10%"] }
          ]
        },
        {
          "word": "Earth",
          "options": [
            { "text": "Planet", "prob": 50, "next": ["Pacific 70%", "Atlantic 20%", "Indian 10%"] },
            { "text": "World", "prob": 30, "next": ["Global 55%", "Continental 35%", "Atmospheric 10%"] },
            { "text": "Geography", "prob": 20, "next": ["Surface 60%", "Water coverage 30%", "Land mass 10%"] }
          ]
        }
      ],
      "outputAnswers": [
        { "label": "Pacific", "text": "The Pacific Ocean is the largest ocean on Earth, stretching across vast distances and containing some of the deepest trenches in the world. It plays a major role in Earth's climate and marine ecosystems." },
        { "label": "Atlantic", "text": "The Atlantic Ocean is the second-largest ocean and an important route for trade, weather, and marine life. It has shaped global history through travel and exploration." },
        { "label": "Indian", "text": "The Indian Ocean is warm, biologically rich, and important for shipping and regional climate patterns. It is one of the most significant oceans for trade and weather systems." },
        { "label": "Asking", "text": "An asking framing indicates an interrogative search for geographic superlatives, targeting the specific body of water that holds the record for total surface area." },
        { "label": "Requesting", "text": "Requesting data on global ocean dimensions shifts the retrieval focus toward formal metrics, boundaries, and total square kilometers." },
        { "label": "Wondering", "text": "Wondering about the physical scale of the planet's waters opens up a broader exploration of how deep trenches and expansive basins are distributed across the globe." },
        { "label": "Meaning", "text": "The environmental meaning of a massive water basin relates to its capacity to store immense amounts of solar heat, driving global weather patterns." },
        { "label": "Purpose", "text": "The primary ecological purpose of a vast oceanic basin is to act as a major carbon sink and support the planet's largest continuous ecosystems." },
        { "label": "Nature", "text": "The physical nature of the ocean includes its high salinity, deep trenches, and shifting continental boundaries that change over millions of years." },
        { "label": "Name", "text": "Originally given the name 'Mar Pacífico' by explorer Ferdinand Magellan due to its calm waters, the title translates directly to 'Peaceful Sea'." },
        { "label": "Type", "text": "As a specific type of major marine reservoir, a primary basin completely separates massive continental plates rather than sitting trapped between small landmasses." },
        { "label": "Category", "text": "It fits cleanly into the category of major oceanic divisions, standing well above secondary seas, gulfs, and bays in sheer volume." },
        { "label": "State of being", "text": "In its modern state of being, the basin experiences constant tectonic activity, surrounded by a volatile perimeter known as the Ring of Fire." },
        { "label": "Existence", "text": "Its ancient existence predates modern continents, originating from the vast Panthalassa Ocean that once surrounded the Pangea supercontinent." },
        { "label": "Identity", "text": "The unique identity of this body of water is defined by its unparalleled width, stretching wide enough to comfortably contain all of Earth's landmasses combined." },
        { "label": "Linking", "text": "Linking different hemispheres together, this massive expanse of water connects the coastlines of the Americas directly to Asia and Australasia." },
        { "label": "Describing", "text": "Describing the scale of the water reveals that it accounts for nearly half of the planet's total water surface and over one-third of the entire globe." },
        { "label": "Equating", "text": "Equating this body of water to the ultimate global sink emphasizes its role in receiving major river outflows from surrounding continents." },
        { "label": "Present tense", "text": "In the present tense of modern climatology, we monitor how shifting surface temperatures in this basin trigger El Niño and La Niña events worldwide." },
        { "label": "Progressive", "text": "A progressive mapping of the sea floor uses advanced sonar arrays to slowly trace hidden mountain ranges and deep subduction zones." },
        { "label": "Passive", "text": "Vast quantities of plastic debris are passively swept into rotating currents, forming concentrated garbage patches within the central gyres." },
        { "label": "Definite", "text": "Definite boundaries established by international hydrographic groups officially separate this primary basin from adjacent southern and polar waters." },
        { "label": "Specific", "text": "Specific shipping routes across the northern expanse require careful seasonal navigation to avoid intense winter storms and dense fields of sea ice." },
        { "label": "General", "text": "In general terms, navigating across its widest point requires crossing over seventeen thousand kilometers of open, deep blue water." }
      ],
      "answer": "The largest ocean on Earth is the Pacific Ocean, covering over 30% of the planet's surface—more than all the Earth's land area combined.\n\nIt is bounded by the continents of Asia and Australia in the west and the Americas in the east."
    }
  ]
};