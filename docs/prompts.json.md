========================================================
prompts.json — DATA STRUCTURE DOCUMENTATION
AI Learning Game Project
========================================================

PURPOSE
--------------------------------------------------------
This file stores prompt templates used in the game.

Prompts are the starting point of each challenge and define
what the user must solve or explore.

They are designed to:
- vary gameplay
- support multiple difficulty levels
- create realistic AI interaction scenarios

========================================================
STRUCTURE
========================================================

The file contains an array of prompt objects:

{
  "id": number,
  "text": string,
  "category": string,
  "difficulty": string
}

========================================================
FIELD EXPLANATION
========================================================

id
--------------------------------------------------------
Unique identifier for each prompt.

Example:
"id": 101


text
--------------------------------------------------------
The actual prompt shown to the user.

Example:
"Explain AI in simple terms for a student."


category
--------------------------------------------------------
Groups prompts into learning themes.

Possible values:
- "explanation"
- "creative"
- "analysis"
- "problem-solving"


difficulty
--------------------------------------------------------
Defines complexity level.

Possible values:
- "easy"
- "medium"
- "hard"

========================================================
USAGE IN SYSTEM
========================================================

Used by:
- promptSystem.js → selects and displays prompts
- gameLogic.js → adjusts difficulty progression
- aiSimulation.js → determines simulation depth

========================================================
DESIGN GOAL
========================================================

This file is designed to:
✔ Provide variety in gameplay
✔ Allow easy expansion of prompt types
✔ Support structured difficulty scaling
✔ Keep content separated from logic

========================================================
END OF FILE
========================================================