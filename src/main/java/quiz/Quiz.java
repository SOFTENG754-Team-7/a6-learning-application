package quiz;

public class Quiz {
    private String questionId;
    private String question;
    private String[] options;
    private String correctAnswer;

    public Quiz(String questionId, String question, 
                String[] options, String correctAnswer) {
        this.questionId = questionId;
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    // Getters
    public String getQuestionId() { return questionId; }
    public String getQuestion() { return question; }
    public String[] getOptions() { return options; }
    public String getCorrectAnswer() { return correctAnswer; }
}
