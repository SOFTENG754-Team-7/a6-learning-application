package quiz;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    // Simulated question bank - 5 OOP questions
    private static final Map<String, Quiz> questions = new HashMap<>();

    static {
        questions.put("q1", new Quiz(
            "q1",
            "Class 'Dog' extends class 'Animal'. What does this mean?",
            new String[]{
                "A) Dog and Animal are unrelated classes",
                "B) Dog inherits the fields and methods of Animal",
                "C) Animal inherits the fields and methods of Dog",
                "D) Dog and Animal share the same constructor"
            },
            "B"
        ));
        questions.put("q2", new Quiz(
            "q2",
            "Which option best describes a superclass?",
            new String[]{
                "A) A class that is inherited by another class",
                "B) A class that cannot be instantiated",
                "C) A class whose fields and methods are inherited by another class",
                "D) A class with only static methods"
            },
            "C"
        ));
        questions.put("q3", new Quiz(
            "q3",
            "A subclass wants to call a method defined in its superclass. Which keyword is used?",
            new String[]{
                "A) this",
                "B) parent",
                "C) base",
                "D) super"
            },
            "D"
        ));
        questions.put("q4", new Quiz(
            "q4",
            "Which is a key benefit of inheritance?",
            new String[]{
                "A) It prevents any method from being overridden",
                "B) It allows code reuse by sharing fields and methods across classes",
                "C) It ensures all classes have the same methods",
                "D) It removes the need for constructors in subclasses"
            },
            "B"
        ));
        questions.put("q5", new Quiz(
            "q5",
            "Which of the following is not inherited by a subclass?",
            new String[]{
                "A) Public methods",
                "B) Protected fields",
                "C) Private fields",
                "D) All of the above are inherited"
            },
            "C"
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