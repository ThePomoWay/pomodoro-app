export function playAlarmSound() {
  let audio = new Audio("/sounds/clock.wav");
  audio.play();

  setTimeout(() => {
    audio.pause();
  }, 5000);
}
