let coinPosition;
let currentLevel = 1;
const maxLevel = 30;
let money = 0;
let inputLocked = false;
let nickname = "";
let timerInterval;
let timeLeft = 0;

const levelEl = document.getElementById("level");
const moneyEl = document.getElementById("money");
const resultEl = document.getElementById("result");
const gameContainer = document.getElementById("game");
const gameOver = document.getElementById("game-over");
const nicknameDisplay = document.getElementById("nickname-display");
const highScoreDisplay = document.getElementById("high-score");
const timerEl = document.getElementById("timer");

const soundSuccess = document.getElementById("soundSuccess");
const soundFail = document.getElementById("soundFail");

// Başlangıç ekranından başla
function startGame() {
  const input = document.getElementById("nickname-input");
  if (!input.value.trim()) {
    alert("Please enter a nickname!");
    return;
  }

  nickname = input.value.trim();
  document.getElementById(
    "nickname-display"
  ).textContent = `Player: ${nickname}`;
  document.getElementById("start-screen").classList.add("hidden");
  gameContainer.classList.remove("hidden");

  resetGame();
  startLevel();
}

function resetGame() {
  currentLevel = 1;
  money = 0;
  levelEl.textContent = currentLevel;
  moneyEl.textContent = "$" + money;
  resultEl.textContent = "";
  gameOver.classList.add("hidden");
  gameContainer.classList.remove("hidden");
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
  const selectedColor = selectedBall.classList.contains("yellow")
    ? "yellow"
    : selectedBall.classList.contains("blue")
    ? "blue"
    : "green";

  allBalls.forEach((ball) => {
    ball.classList.remove(
      "correct-ball",
      "match-yellow",
      "match-blue",
      "match-green"
    );
    ball.style.transform = "scale(1)";
  });

  if (guess === coinPosition) {
    selectedBall.classList.add("correct-ball");
    money = currentLevel;
    moneyEl.textContent = "$" + money;
    resultEl.innerHTML = `<span style="color:green;font-weight:bold;">✅ You earned $${money}!</span>`;
    playSound(soundSuccess);

    document.querySelectorAll(".ball").forEach((ball, i) => {
      if (i !== guess) {
        ball.classList.add(`match-${selectedColor}`);
      }
    });

    setTimeout(() => {
      if (currentLevel < maxLevel) {
        currentLevel++;
        levelEl.textContent = currentLevel;
        resultEl.textContent = "";
        startLevel();
      } else {
        resultEl.textContent = "🏆 You completed all levels!";
      }
    }, 2000);
  } else {
    playSound(soundFail);
    endGame();
  }
}

function endGame() {
  inputLocked = true;
  resultEl.textContent = "❌ Time's up or wrong guess!";
  gameContainer.classList.add("wipe-out");

  setTimeout(() => {
    gameContainer.classList.add("hidden");
    gameOver.classList.remove("hidden");

    const storedHighScore = parseInt(localStorage.getItem(nickname)) || 0;
    if (money > storedHighScore) {
      localStorage.setItem(nickname, money);
    }
    highScoreDisplay.textContent = "$" + Math.max(money, storedHighScore);
  }, 2000);
}

function resetBalls() {
  document.querySelectorAll(".ball").forEach((ball) => {
    ball.classList.remove(
      "correct-ball",
      "match-yellow",
      "match-blue",
      "match-green"
    );
    ball.style.transform = "scale(1)";
  });
}

function restartGame() {
  document.getElementById("start-screen").classList.remove("hidden");
  gameOver.classList.add("hidden");
  gameContainer.classList.add("hidden");
}
