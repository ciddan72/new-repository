// DOM
const game = document.getElementById("game");
const gameOver = document.getElementById("game-over");
const result = document.getElementById("result");
const topPlayer = document.getElementById("top-player");
const levelEl = document.getElementById("level");
const moneyEl = document.getElementById("money");
const playCountEl = document.getElementById("play-count");
const nicknameInput = document.getElementById("nickname-input");
const startScreen = document.getElementById("start-screen");

// Sesler
const soundSuccess = document.getElementById("soundSuccess");
const soundFail = document.getElementById("soundFail");

// Veriler
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

// Oyuna başla
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

// Oyun sıfırlama
function resetGame() {
  level = 1;
  money = 0;
  updateUI();
  newRound();
}

// Yeni tur başlat
function newRound() {
  correctIndex = Math.floor(Math.random() * 3);
  resetBalls();
  result.textContent = "";
  timeLeft = level <= 5 ? 20 : 10;
  updateTimer();
  timer = setInterval(updateTimer, 1000);
}

// Sayaç güncelle
function updateTimer() {
  const timerEl = document.getElementById("timer");
  timerEl.textContent = timeLeft;
  if (timeLeft === 0) {
    clearInterval(timer);
    handleWrongGuess();
  }
  timeLeft--;
}

// Tahmin
function makeGuess(index) {
  clearInterval(timer);
  const balls = document.querySelectorAll(".ball");
  if (index === correctIndex) {
    balls[index].classList.add("correct-ball");

    // Diğer toplar kazanan topun rengine dönüşsün
    const color = balls[index].classList.contains("yellow")
      ? "yellow"
      : balls[index].classList.contains("blue")
      ? "blue"
      : "green";

    balls.forEach((ball) => {
      ball.classList.remove("yellow", "blue", "green");
      ball.classList.add(`match-${color}`);
    });

    soundSuccess.currentTime = 0;
    soundSuccess.play();

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

// Kaybetme durumu
function handleWrongGuess() {
  soundFail.currentTime = 0;
  soundFail.play();

  totalPlays++;
  localStorage.setItem("totalPlays", totalPlays);

  if (level > topScore.level) {
    topScore = { name: nickname, level: level - 1 };
    localStorage.setItem("topScore", JSON.stringify(topScore));
  }

  showGameOver();
}

// Game Over ekranı
function showGameOver(won = false) {
  game.classList.add("hidden");
  gameOver.classList.remove("hidden");
  topPlayer.textContent = `${topScore.name}: Level ${topScore.level}`;
}

// Tekrar oyna
function restartGame() {
  gameOver.classList.add("hidden");
  game.classList.remove("hidden");
  resetGame();
}

// UI güncelle
function updateUI() {
  levelEl.textContent = level;
  moneyEl.textContent = `$${money}`;
  playCountEl.textContent = `Played: ${totalPlays.toLocaleString()} (${numberToWords(
    totalPlays
  )})`;
}

// Ball sıfırla
function resetBalls() {
  const balls = document.querySelectorAll(".ball");
  balls.forEach((ball) => {
    ball.classList.remove(
      "correct-ball",
      "match-yellow",
      "match-blue",
      "match-green"
    );
    ball.classList.add("yellow", "blue", "green"); // garanti olarak ekle
    const colorClass = ["yellow", "blue", "green"];
    const randomColor = colorClass[Math.floor(Math.random() * 3)];
    ball.classList.remove("yellow", "blue", "green");
    ball.classList.add(randomColor);
  });
}

// Ayarları aç/kapat
function toggleSettings() {
  const menu = document.getElementById("settingsMenu");
  menu.classList.toggle("hidden");
}

// Sayıdan yazıya çevirme (kısaca)
function numberToWords(num) {
  if (num === 0) return "zero";
  return num.toLocaleString("en-US");
}

// Sayaç kutusuna tıklanınca
function handlePlayCountClick() {
  alert(`Game has been played ${totalPlays.toLocaleString()} times!`);
}

// Sayfa açıldığında otomatik başlat (nickname varsa)
if (nickname) {
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");
  resetGame();
}
