export function playAlarmSound() {
  let audio = new Audio("/sounds/end-timer.mp3");
  audio.play();

  setTimeout(() => {
    audio.pause();
  }, 5000);
}
let timerStartAudio = new Audio("/sounds/start-timer.mp3");
export function playTimerStartSound() {
  timerStartAudio.play();

  setTimeout(() => {
    timerStartAudio.pause();
  }, 5000);
}

export function playCompleteTaskSound() {
  let completeTaskAudio = new Audio("/sounds/complete-task-2.wav");
  completeTaskAudio.play();

  setTimeout(() => {
    completeTaskAudio.pause();
  }, 1000);
}
