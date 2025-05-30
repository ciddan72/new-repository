const game = document.getElementById("game");
const gameOver = document.getElementById("game-over");
const result = document.getElementById("result");
const topPlayer = document.getElementById("top-player");
const levelEl = document.getElementById("level");
const moneyEl = document.getElementById("money");
const playCountEl = document.getElementById("play-count");
const nicknameInput = document.getElementById("nickname-input");
const startScreen = document.getElementById("start-screen");

let correctIndex;
let level = 1;
let money = 0;
let timer;
let timeLeft = 0;
let nickname = localStorage.getItem("nickname") || null;
let topScore = JSON.parse(localStorage.getItem("topScore")) || {
  name: "None",
  level: 0,
};
let totalPlays = parseInt(localStorage.getItem("totalPlays")) || 0;

function handleStart() {
  const inputVal = nicknameInput.value.trim();
  if (!nickname && inputVal) {
    nickname = inputVal;
    localStorage.setItem("nickname", nickname);
  }
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");
  resetGame();
}

function resetGame() {
  level = 1;
  money = 0;
  updateUI();
  newRound();
}

function newRound() {
  correctIndex = Math.floor(Math.random() * 3);
  assignBallColors();
  result.textContent = "";
  timeLeft = level <= 5 ? 20 : 10;
  updateTimer();
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const timerEl = document.getElementById("timer");
  timerEl.textContent = timeLeft;
  if (timeLeft === 0) {
    clearInterval(timer);
    handleWrongGuess();
  }
  timeLeft--;
}

function makeGuess(index) {
  clearInterval(timer);
  const balls = document.querySelectorAll(".ball");
  if (index === correctIndex) {
    balls[index].classList.add("correct-ball");

    const color = getBallColor(balls[index]);
    balls.forEach((ball) => {
      ball.classList.remove("yellow", "blue", "green");
      ball.classList.add(`match-${color}`);
    });

    money++;
    level++;

    updateUI();

    if (level > 30) {
      showGameOver(true);
      return;
    }

    setTimeout(newRound, 2000);
  } else {
    handleWrongGuess();
  }
}

function handleWrongGuess() {
  totalPlays++;
  localStorage.setItem("totalPlays", totalPlays);

  if (level > topScore.level) {
    topScore = { name: nickname, level: level - 1 };
    localStorage.setItem("topScore", JSON.stringify(topScore));
  }

  showGameOver();
}

function showGameOver(won = false) {
  game.classList.add("hidden");
  gameOver.classList.remove("hidden");
  topPlayer.textContent = `${topScore.name}: Level ${topScore.level}`;
}

function restartGame() {
  gameOver.classList.add("hidden");
  game.classList.remove("hidden");
  resetGame();
}

function updateUI() {
  levelEl.textContent = level;
  moneyEl.textContent = `$${money}`;
  playCountEl.textContent = `Played: ${totalPlays.toLocaleString()} (${numberToWords(
    totalPlays
  )})`;
}

function assignBallColors() {
  const balls = document.querySelectorAll(".ball");
  const colors = ["yellow", "blue", "green"];
  const shuffled = [...colors].sort(() => 0.5 - Math.random()); // Shuffle

  balls.forEach((ball, i) => {
    ball.className = "ball"; // Reset classes
    ball.classList.add(shuffled[i]); // Assign unique color
  });
}

function getBallColor(ball) {
  if (ball.classList.contains("yellow")) return "yellow";
  if (ball.classList.contains("blue")) return "blue";
  return "green";
}

function toggleSettings() {
  const menu = document.getElementById("settingsMenu");
  menu.classList.toggle("hidden");
}

function numberToWords(num) {
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100)
    return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();
  return num.toLocaleString("en-US");
}

function handlePlayCountClick() {
  alert(`Game has been played ${totalPlays.toLocaleString()} times!`);
}

if (nickname) {
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");
  resetGame();
}
