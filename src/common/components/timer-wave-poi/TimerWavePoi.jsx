export function TimerWavePoi(props) {

    
    return (
        <div className={`${styles.round} ${styles['border-red']} grid grid-center`} style={timerStyle}>
            <span className={styles['timer-text']}> {timerString}</span>
            {getCTA(state)}
        </div>
    )
}