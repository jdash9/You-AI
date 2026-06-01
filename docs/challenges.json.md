========================================================
challenges.json — DATA STRUCTURE DOCUMENTATION
AI Learning Game Project
========================================================

PURPOSE
--------------------------------------------------------
This file contains all interactive learning challenges.

Each challenge represents one “level” in the game where the user:
- receives a prompt
- selects AI-like processing steps
- receives feedback
- earns a score

========================================================
STRUCTURE
========================================================

Each entry in the JSON array has the following structure:

{
  "id": number,
  "prompt": string,
  "difficulty": string, (optional)
  "steps": array of strings,
  "correctPath": array of strings,
  "hints": array of strings (optional)
}

========================================================
FIELD EXPLANATION
========================================================

id
--------------------------------------------------------
Unique identifier for each challenge.

Example:
"id": 1


prompt
--------------------------------------------------------
The task shown to the user.

Example:
"Explain how AI generates text"


difficulty (optional)
--------------------------------------------------------
Defines how complex the challenge is.

Possible values:
- "easy"
- "medium"
- "hard"


steps
--------------------------------------------------------
List of possible AI-process steps the user can choose from.

Example:
[
  "Analyze input",
  "Search patterns",
  "Generate output"
]


correctPath
--------------------------------------------------------
The correct sequence of steps that represents the AI process.

Used to:
- calculate score
- evaluate user decisions

Example:
[
  "Analyze input",
  "Search patterns",
  "Generate output"
]


hints (optional)
--------------------------------------------------------
Helpful tips shown to the user if they struggle.

Example:
[
  "Think about how AI understands language",
  "What happens before an answer is generated?"
]

========================================================
USAGE IN SYSTEM
========================================================

Used by:
- promptSystem.js → displays challenge
- aiSimulation.js → simulates process
- feedbackSystem.js → evaluates correctness
- gameLogic.js → tracks progress

========================================================
DESIGN GOAL
========================================================

This file is designed to be:
✔ Easy to extend with new challenges
✔ Human-readable for students
✔ Structured for game logic processing
✔ Compatible with simple JSON fetching (no backend needed)

========================================================
END OF FILE
========================================================