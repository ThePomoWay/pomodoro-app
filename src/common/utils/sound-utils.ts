let soundPlayerTimeout: any = 0;
let currentAudioObj: any;

const completeTaskAudioUrl = "/sounds/complete-task-2-cropped.wav";
const alarmAudioUrl = "/sounds/end-timer.mp3";
const timerStartAudioUrl = "/sounds/start-timer.mp3";

function resetSoundPlayerTimeout() {
  soundPlayerTimeout = 0;
  currentAudioObj = null;
}

function playSound(audioObj, timeout, url?) {
  if (soundPlayerTimeout) {
    clearTimeout(soundPlayerTimeout);
    currentAudioObj && currentAudioObj.pause();
    resetSoundPlayerTimeout();

    completeTaskAudio = new Audio(url);

    // Yes I like to live dangerously.
    setTimeout(() => playSound(completeTaskAudio, timeout), 100);
  } else {
    audioObj.play();
    soundPlayerTimeout = setTimeout(() => {
      currentAudioObj.pause();
      resetSoundPlayerTimeout();
      completeTaskAudio = new Audio(url);
    }, timeout);
    currentAudioObj = audioObj;
  }
}

let alarmSoundObj = new Audio(alarmAudioUrl);

export function playAlarmSound() {
  playSound(alarmSoundObj, 5000, alarmAudioUrl);
}
let timerStartAudio = new Audio(timerStartAudioUrl);
export function playTimerStartSound() {
  playSound(timerStartAudio, 5000, timerStartAudioUrl);
}

let completeTaskAudio = new Audio(completeTaskAudioUrl);
export function playCompleteTaskSound() {
  playSound(completeTaskAudio, 1000, completeTaskAudioUrl);
}
