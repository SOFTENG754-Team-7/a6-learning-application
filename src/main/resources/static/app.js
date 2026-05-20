const homeSection = document.getElementById("home");
const quizSection = document.getElementById("quiz");
const resultsSection = document.getElementById("results");
const questionText = document.getElementById("question-text");
const optionsRoot = document.getElementById("options");
const feedback = document.getElementById("feedback");
const submitButton = document.getElementById("submit-answer");
const nextButton = document.getElementById("next-question");
const startButton = document.getElementById("start-quiz");
const playAgainButton = document.getElementById("play-again");
const resultsScore = document.getElementById("results-score");

const questionOrder = ["q1", "q2", "q3", "q4", "q5"];
let currentQuestionId = null;
let currentIndex = -1;
let selectedAnswer = null;
let correctCount = 0;

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
      throw new Error("Question not found. Try q1, q2, q3, q4, or q5.");
    }

    const data = await response.json();
    currentQuestionId = data.questionId;
    const orderIndex = questionOrder.indexOf(data.questionId);
    const questionNumber = orderIndex >= 0 ? orderIndex + 1 : currentIndex + 1;
    questionText.textContent = `Q${questionNumber}. ${data.question}`;
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
    if (data.correct) {
      correctCount += 1;
    }
    setOptionsDisabled(true);
    submitButton.disabled = true;

    if (currentIndex >= questionOrder.length - 1) {
      nextButton.textContent = "View Results";
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
  correctCount = 0;
  resultsScore.textContent = "0/0";
  clearFeedback();
  quizSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  homeSection.classList.remove("hidden");
}

function showResults() {
  resultsScore.textContent = `${correctCount}/${questionOrder.length}`;
  quizSection.classList.add("hidden");
  homeSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
}

function startQuiz() {
  currentIndex = 0;
  correctCount = 0;
  loadQuestion(questionOrder[currentIndex]);
}

function goToNext() {
  if (currentIndex >= questionOrder.length - 1) {
    showResults();
    return;
  }
  currentIndex += 1;
  loadQuestion(questionOrder[currentIndex]);
}

startButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", submitAnswer);
nextButton.addEventListener("click", goToNext);
playAgainButton.addEventListener("click", showHome);

showHome();
