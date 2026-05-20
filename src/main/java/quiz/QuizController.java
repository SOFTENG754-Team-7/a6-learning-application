package quiz;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    // Simulated question bank - 3 OOP questions
    private static final Map<String, Quiz> questions = new HashMap<>();

    static {
        questions.put("q1", new Quiz(
            "q1",
            "What is encapsulation in OOP?",
            new String[]{
                "A) Hiding internal state and requiring interaction through methods",
                "B) Creating multiple instances of a class",
                "C) Extending a class",
                "D) Overriding a method"
            },
            "A"
        ));
        questions.put("q2", new Quiz(
            "q2",
            "Which keyword is used for inheritance in Java?",
            new String[]{"A) implements", "B) extends", "C) inherits", "D) super"},
            "B"
        ));
        questions.put("q3", new Quiz(
            "q3",
            "What is polymorphism?",
            new String[]{
                "A) A class with no methods",
                "B) The ability of an object to take many forms",
                "C) A private variable",
                "D) A static method"
            },
            "B"
        ));
    }

    // GET - fetch a question
    @GetMapping("/{questionId}")
    public ResponseEntity<?> getQuestion(@PathVariable String questionId) {
        Quiz quiz = questions.get(questionId);
        if (quiz == null) {
            return ResponseEntity.status(404).body("Question not found");
        }
        // Return question without revealing the answer
        Map<String, Object> response = new HashMap<>();
        response.put("questionId", quiz.getQuestionId());
        response.put("question", quiz.getQuestion());
        response.put("options", quiz.getOptions());
        return ResponseEntity.ok(response);
    }

    // POST - submit an answer
    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(@RequestBody Map<String, String> submission) {
        String questionId = submission.get("questionId");
        String userAnswer = submission.get("answer");

        if (questionId == null || userAnswer == null) {
            return ResponseEntity.status(400).body("Missing questionId or answer");
        }

        Quiz quiz = questions.get(questionId);
        if (quiz == null) {
            return ResponseEntity.status(404).body("Question not found");
        }

        boolean isCorrect = quiz.getCorrectAnswer().equalsIgnoreCase(userAnswer.trim());

        Map<String, Object> response = new HashMap<>();
        response.put("questionId", questionId);
        response.put("correct", isCorrect);
        response.put("feedback", isCorrect 
            ? "Correct! Well done." 
            : "Incorrect. The correct answer was: " + quiz.getCorrectAnswer());

        return ResponseEntity.ok(response);
    }
}