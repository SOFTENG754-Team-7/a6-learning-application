const homeSection = document.getElementById("home");
const quizSection = document.getElementById("quiz");
const questionText = document.getElementById("question-text");
const optionsRoot = document.getElementById("options");
const feedback = document.getElementById("feedback");
const submitButton = document.getElementById("submit-answer");
const nextButton = document.getElementById("next-question");
const startButton = document.getElementById("start-quiz");

const questionOrder = ["q1", "q2", "q3"];
let currentQuestionId = null;
let currentIndex = -1;
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

function setOptionsDisabled(isDisabled) {
  const inputs = optionsRoot.querySelectorAll("input");
  inputs.forEach((input) => {
    input.disabled = isDisabled;
  });
}

function renderOptions(options) {
  optionsRoot.innerHTML = "";
  selectedAnswer = null;
  submitButton.disabled = true;
  nextButton.classList.add("hidden");
  setOptionsDisabled(false);

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
    quizSection.classList.remove("hidden");
    homeSection.classList.add("hidden");
  } catch (error) {
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
    setOptionsDisabled(true);
    submitButton.disabled = true;

    if (currentIndex >= questionOrder.length - 1) {
      nextButton.textContent = "Back to homepage";
    } else {
      nextButton.textContent = "Next Question";
    }
    nextButton.classList.remove("hidden");
  } catch (error) {
    setFeedback(error.message, true);
  }
}

function showHome() {
  currentIndex = -1;
  currentQuestionId = null;
  selectedAnswer = null;
  clearFeedback();
  quizSection.classList.add("hidden");
  homeSection.classList.remove("hidden");
}

function startQuiz() {
  currentIndex = 0;
  loadQuestion(questionOrder[currentIndex]);
}

function goToNext() {
  if (currentIndex >= questionOrder.length - 1) {
    showHome();
    return;
  }
  currentIndex += 1;
  loadQuestion(questionOrder[currentIndex]);
}

startButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", submitAnswer);
nextButton.addEventListener("click", goToNext);

showHome();
