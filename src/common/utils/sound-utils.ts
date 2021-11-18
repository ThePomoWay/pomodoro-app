export function playAlarmSound() {
    let audio = new Audio('/sounds/alarm.wav');
    audio.play();

    setTimeout(() => {
        audio.pause();
    }, 3000)
}