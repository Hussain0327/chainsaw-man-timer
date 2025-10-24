const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const music = document.getElementById("music");
const timerDisplay = document.getElementById("countDown");
const durationInput = document.getElementById("workDuration");
const audio = document.getElementById("audio");


let timeLeft = 0;         
let isTimerOn = false;
let intervalId = null;
let endAt = null;          

function getDuration() {
  
  const minutes = Math.max(1, Math.min(120, parseInt(durationInput.value, 10) || 25));
  durationInput.value = String(minutes);
  return minutes * 60;
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")} : ${seconds
    .toString()
    .padStart(2, "0")}`;
}

function tick() {
  
  const now = Date.now();
  const remaining = Math.max(0, Math.round((endAt - now) / 1000));

  if (remaining !== timeLeft) {
    timeLeft = remaining;
    updateDisplay();
  }

  if (remaining <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    isTimerOn = false;

    
    timerDisplay.style.animation = "pulse 0.5s ease-in-out 3";
    setTimeout(() => {
      timerDisplay.style.animation = "";
      alert("⛓️ Time's up! Chainsaw's roaring!");
      resetTimer();
    }, 1500);
  }
}

function startTimer() {
  if (isTimerOn) return;

  
  if (!Number.isFinite(timeLeft) || timeLeft <= 0) {
    timeLeft = getDuration();
    updateDisplay();
  }

  isTimerOn = true;
  endAt = Date.now() + timeLeft * 1000;

  
  intervalId = setInterval(tick, 250);
  tick(); 
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (isTimerOn && endAt) {
    
    timeLeft = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    updateDisplay();
  }
  isTimerOn = false;
  endAt = null;
}

function resetTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isTimerOn = false;
  endAt = null;
  timeLeft = getDuration();
  updateDisplay();
}


if (music) {
  music.addEventListener("click", async () => {
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        music.textContent = "Pause Music";
      } else {
        audio.pause();
        music.textContent = "Play Music";
      }
    } catch (err) {
      console.error("Audio playback failed:", err);
      alert("Unable to play audio. Your browser may be blocking autoplay/sound.");
    }
  });
}


durationInput.addEventListener("input", () => {
  if (!isTimerOn) {
    timeLeft = getDuration();
    updateDisplay();
  }
});


start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);


(function init() {
  timeLeft = getDuration();  
  updateDisplay();
})();
