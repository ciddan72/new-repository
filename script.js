let currentLevel = 1,
  maxLevel = 30,
  money = 0,
  coinPosition = 0;
let inputLocked = false,
  timerInterval,
  timeLeft = 0;
let nickname = localStorage.getItem("nickname");

const levelEl = document.getElementById("level");
const moneyEl = document.getElementById("money");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");
const gameContainer = document.getElementById("game");
const startScreen = document.getElementById("start-screen");
const gameOver = document.getElementById("game-over");
const topPlayer = document.getElementById("top-player");
const soundSuccess = document.getElementById("soundSuccess");
const soundFail = document.getElementById("soundFail");

if (nickname) {
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  startGame();
}

function handleStart() {
  const input = document.getElementById("nickname-input");
  if (!input.value.trim()) return alert("Please enter a nickname");
  nickname = input.value.trim();
  localStorage.setItem("nickname", nickname);
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  startGame();
}

function startGame() {
  currentLevel = 1;
  money = 0;
  updateDisplay();
  gameOver.classList.add("hidden");
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
    allBalls.forEach((ball, i) => {
      if (i !== guess) ball.classList.add(`match-${selectedColor}`);
    });
    money = currentLevel;
    updateDisplay();
    resultEl.innerHTML = `<span style="color:green;font-weight:bold;">You win: $${money}</span>`;
    playSound(soundSuccess);
    setTimeout(() => {
      if (currentLevel < maxLevel) {
        currentLevel++;
        startLevel();
      } else {
        resultEl.textContent = "🏆 All levels completed!";
        saveScore();
      }
    }, 1500);
  } else {
    playSound(soundFail);
    endGame();
  }
}

function updateDisplay() {
  levelEl.textContent = currentLevel;
  moneyEl.textContent = "$" + money;
  resultEl.textContent = "";
}

function endGame() {
  gameContainer.classList.add("hidden");
  gameOver.classList.remove("hidden");
  saveScore();
  showTopPlayer();
}

function playSound(sound) {
  if (document.getElementById("soundToggle").checked) {
    sound.currentTime = 0;
    sound.play();
  }
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

function saveScore() {
  const scores = JSON.parse(localStorage.getItem("scores")) || {};
  scores[nickname] = Math.max(scores[nickname] || 0, currentLevel - 1);
  localStorage.setItem("scores", JSON.stringify(scores));
}

function showTopPlayer() {
  const scores = JSON.parse(localStorage.getItem("scores")) || {};
  let top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  topPlayer.textContent = top ? `${top[0]}: Level ${top[1]}` : "No scores yet";
}

function restartGame() {
  gameOver.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  startGame();
}

function toggleSettings() {
  document.getElementById("settingsMenu").classList.toggle("hidden");
}
