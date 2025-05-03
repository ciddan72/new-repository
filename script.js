let coinPosition = Math.floor(Math.random() * 3);
let currentLevel = 1;
const maxLevel = 30;
let money = 0;
let inputLocked = false;

const soundSuccess = document.getElementById("soundSuccess");
const soundFail = document.getElementById("soundFail");

function playSound(sound) {
  const soundToggle = document.getElementById("soundToggle");
  if (soundToggle && soundToggle.checked) {
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

  const result = document.getElementById("result");
  const levelSpan = document.getElementById("level");
  const moneySpan = document.getElementById("money");
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

    if (currentLevel <= 10) {
      money = currentLevel;
    }

    moneySpan.textContent = "$" + money;
    result.innerHTML = `<span style="color:green;font-weight:bold;">✅ You earned $${money}!</span>`;
    playSound(soundSuccess);

    allBalls.forEach((ball, i) => {
      if (i !== guess) {
        ball.classList.add(`match-${selectedColor}`);
      }
    });

    setTimeout(() => {
      if (currentLevel < maxLevel) {
        currentLevel++;
        levelSpan.textContent = currentLevel;
        result.textContent = "Next level starting...";
        coinPosition = Math.floor(Math.random() * 3);
        resetBalls();
        inputLocked = false;
      } else {
        result.textContent = "🏆 All levels complete!";
      }
    }, 3000);
  } else {
    playSound(soundFail);
    document.getElementById("game").classList.add("wipe-out");
    document.getElementById("game-over").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("game").classList.add("hidden");
      inputLocked = false;
    }, 2000);
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
    ball.style.backgroundColor = "";
    ball.style.border = "2px solid #000";
    ball.style.transform = "scale(1)";
  });
}

function restartGame() {
  currentLevel = 1;
  money = 0;
  coinPosition = Math.floor(Math.random() * 3);
  document.getElementById("level").textContent = currentLevel;
  document.getElementById("result").textContent = "";
  document.getElementById("money").textContent = "$" + money;
  document.getElementById("game").classList.remove("wipe-out", "hidden");
  document.getElementById("game-over").classList.add("hidden");
  resetBalls();
  inputLocked = false;
}
