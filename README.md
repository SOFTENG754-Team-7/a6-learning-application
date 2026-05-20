# a6-learning-application
## Quiz Submission Feature

A REST API endpoint that serves OOP quiz questions and evaluates student answers.

**Run:** `mvn spring-boot:run` (requires Java 17+, Maven)

**UI:** Open `http://localhost:8080` in a browser to use the quiz interface.

**Endpoints:**
- GET /api/quiz/{questionId} - retrieves a quiz question (q1, q2, q3)
- POST /api/quiz/submit - submits an answer

**POST body example:**
{
  "questionId": "q1",
  "answer": "A"
}

Returns whether the answer is correct and provides feedback.