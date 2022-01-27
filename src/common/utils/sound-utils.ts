export function playAlarmSound() {
    let audio = new Audio('/sounds/alarm.mpeg');
    audio.play();

    setTimeout(() => {
        audio.pause();
    }, 5000)
}