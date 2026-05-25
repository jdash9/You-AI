========================================================
feedback.json — DATA STRUCTURE DOCUMENTATION
AI Learning Game Project
========================================================

PURPOSE
--------------------------------------------------------
This file contains all feedback messages used in the system.

It is responsible for:
- explaining correct/incorrect answers
- guiding user learning
- providing motivational responses
- improving user understanding of AI concepts

========================================================
STRUCTURE
========================================================

The file contains an array of feedback objects:

{
  "id": number,
  "type": string,
  "message": string,
  "explanation": string,
  "tips": array of strings (optional)
}

========================================================
FIELD EXPLANATION
========================================================

id
--------------------------------------------------------
Unique identifier for each feedback entry.

Example:
"id": 201


type
--------------------------------------------------------
Defines feedback category.

Possible values:
- "correct"
- "incorrect"
- "hint"
- "info"


message
--------------------------------------------------------
Short feedback shown to the user.

Example:
"Correct! This is how AI processes input."


explanation
--------------------------------------------------------
Longer explanation of why the answer is correct or incorrect.

Example:
"AI first analyzes input data before generating a response..."


tips (optional)
--------------------------------------------------------
Helpful suggestions for improvement.

Example:
[
  "Try thinking step-by-step",
  "Consider how patterns are used in AI"
]

========================================================
USAGE IN SYSTEM
========================================================

Used by:
- feedbackSystem.js → displays feedback
- gameLogic.js → adjusts score
- aiSimulation.js → compares expected vs user path

========================================================
DESIGN GOAL
========================================================

This file is designed to:
✔ Make feedback consistent and reusable
✔ Separate learning content from logic
✔ Allow easy expansion of feedback types
✔ Support adaptive learning behavior

========================================================
END OF FILE
========================================================