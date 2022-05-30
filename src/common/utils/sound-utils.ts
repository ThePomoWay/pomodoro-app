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

    // completeTaskAudio = new Audio(url);
    // audioObj = new Audio(url);

    setTimeout(() => playSound(audioObj, timeout, url), 100);
  } else {
    audioObj.play();
    soundPlayerTimeout = setTimeout(() => {
      currentAudioObj.pause();
      resetSoundPlayerTimeout();
    }, timeout);
    currentAudioObj = audioObj;
  }
}

let alarmSoundObj = new Audio(alarmAudioUrl);

export function playAlarmSound() {
  playSound(new Audio(alarmAudioUrl), 6000, alarmAudioUrl);
}
let timerStartAudio = new Audio(timerStartAudioUrl);
export function playTimerStartSound() {
  playSound(new Audio(timerStartAudioUrl), 6000, timerStartAudioUrl);
}

let completeTaskAudio = new Audio(completeTaskAudioUrl);
export function playCompleteTaskSound() {
  playSound(new Audio(completeTaskAudioUrl), 1000, completeTaskAudioUrl);
}
