const questionForm = document.getElementById("question-form");
const questionPanel = document.getElementById("question-panel");
const questionText = document.getElementById("question-text");
const optionsRoot = document.getElementById("options");
const feedback = document.getElementById("feedback");
const submitButton = document.getElementById("submit-answer");

let currentQuestionId = null;
let selectedAnswer = null;

function setFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.classList.remove("hidden");
  feedback.style.borderColor = isError ? "#c82f2f" : "#e6d9c7";
  feedback.style.background = isError ? "#fae6e6" : "#f5eee6";
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.classList.add("hidden");
}

function renderOptions(options) {
  optionsRoot.innerHTML = "";
  selectedAnswer = null;
  submitButton.disabled = true;

  options.forEach((option) => {
    const label = document.createElement("label");
    label.className = "option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = option.charAt(0);

    input.addEventListener("change", () => {
      selectedAnswer = input.value;
      submitButton.disabled = false;
    });

    const text = document.createElement("span");
    text.textContent = option;

    label.appendChild(input);
    label.appendChild(text);
    optionsRoot.appendChild(label);
  });
}

async function loadQuestion(questionId) {
  clearFeedback();

  try {
    const response = await fetch(`/api/quiz/${questionId}`);
    if (!response.ok) {
      throw new Error("Question not found. Try q1, q2, or q3.");
    }

    const data = await response.json();
    currentQuestionId = data.questionId;
    questionText.textContent = data.question;
    renderOptions(data.options);
    questionPanel.classList.remove("hidden");
  } catch (error) {
    questionPanel.classList.add("hidden");
    setFeedback(error.message, true);
  }
}

async function submitAnswer() {
  if (!currentQuestionId || !selectedAnswer) {
    return;
  }

  try {
    const response = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: currentQuestionId,
        answer: selectedAnswer,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data || "Unable to submit answer.");
    }

    setFeedback(data.feedback, !data.correct);
  } catch (error) {
    setFeedback(error.message, true);
  }
}

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const questionId = new FormData(questionForm).get("questionId").trim();
  if (!questionId) {
    setFeedback("Enter a question ID to load.", true);
    return;
  }
  loadQuestion(questionId);
});

submitButton.addEventListener("click", submitAnswer);
