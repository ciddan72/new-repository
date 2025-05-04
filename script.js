let coinPosition;
let currentLevel = 1;
const maxLevel = 30;
let money = 0;
let inputLocked = false;
let timerInterval;
let timeLeft = 0;
let nickname = localStorage.getItem("nickname");

// DOM
const levelEl = document.getElementById("level");
const moneyEl = document.getElementById("money");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const gameContainer = document.getElementById("game");
const startScreen = document.getElementById("start-screen");
const gameOver = document.getElementById("game-over");
const scoreboard = document.getElementById("scoreboard");

// Ses
const soundSuccess = document.getElementById("soundSuccess");
const soundFail = document.getElementById("soundFail");

if (nickname) {
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  startGame();
}

function handleStart() {
  const input = document.getElementById("nickname-input");
  if (!input.value.trim()) {
    alert("Please enter a nickname!");
    return;
  }

  nickname = input.value.trim();
  localStorage.setItem("nickname", nickname);
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  startGame();
}

function startGame() {
  currentLevel = 1;
  money = 0;
  levelEl.textContent = currentLevel;
  moneyEl.textContent = "$" + money;
  resultEl.textContent = "";
  gameOver.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  startLevel();
}

function startLevel() {
  resetBalls();
  coinPosition = Math.floor(Math.random() * 3);
  inputLocked = false;

  timeLeft = currentLevel <= 5 ? 20 : 10;
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = timeLeft;
}

function playSound(sound) {
  if (document.getElementById("soundToggle").checked) {
    sound.currentTime = 0;
    sound.play();
  }
}

function toggleSettings() {
  document.getElementById("settingsMenu").classList.toggle("hidden");
}

function makeGuess(guess) {
  if (inputLocked) return;
  inputLocked = true;
  clearInterval(timerInterval);

  const selectedBall = document.getElementById(`ball-${guess}`);
  const allBalls = document.querySelectorAll(".ball");

  allBalls.forEach((ball) => {
    ball.classList.remove("correct-ball");
    ball.style.transform = "scale(1)";
  });

  if (guess === coinPosition) {
    selectedBall.classList.add("correct-ball");
    money = currentLevel;
    moneyEl.textContent = "$" + money;
    resultEl.innerHTML = `<span style="color:green;font-weight:bold;">✅ You earned $${money}!</span>`;
    playSound(soundSuccess);

    setTimeout(() => {
      if (currentLevel < maxLevel) {
        currentLevel++;
        levelEl.textContent = currentLevel;
        resultEl.textContent = "";
        startLevel();
      } else {
        resultEl.textContent = "🏆 You completed all levels!";
        saveHighScore();
      }
    }, 1500);
  } else {
    playSound(soundFail);
    endGame();
  }
}

function endGame() {
  inputLocked = true;
  resultEl.textContent = "❌ Time's up or wrong guess!";
  gameContainer.classList.add("hidden");
  gameOver.classList.remove("hidden");
  saveHighScore();
  showScoreboard();
}

function resetBalls() {
  document.querySelectorAll(".ball").forEach((ball) => {
    ball.classList.remove("correct-ball");
    ball.style.transform = "scale(1)";
  });
}

function saveHighScore() {
  const scores = JSON.parse(localStorage.getItem("scores")) || {};
  scores[nickname] = Math.max(scores[nickname] || 0, currentLevel - 1);
  localStorage.setItem("scores", JSON.stringify(scores));
}

function showScoreboard() {
  const scores = JSON.parse(localStorage.getItem("scores")) || {};
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  scoreboard.innerHTML = "";
  sorted.forEach(([name, score]) => {
    const li = document.createElement("li");
    li.textContent = `${name}: Level ${score}`;
    scoreboard.appendChild(li);
  });
}

function restartGame() {
  gameOver.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  startGame();
}
