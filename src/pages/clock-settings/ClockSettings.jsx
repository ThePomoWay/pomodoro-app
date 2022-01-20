import { Slider } from '@material-ui/core';
import styles from './ClockSettings.module.scss';

export default function ClockSettings(props) {

    

    return (
        <div className={styles['clock-settings']}>
            <div>
                Default pomodoro time
            </div>
            
            <div className={styles['slider']}>
                <Slider
                    aria-label="Temperature"
                    defaultValue={25}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={25}
                    max={45}
                    />
            </div>
            <span>
                Default break time
            </span>
            <Slider
                aria-label="Temperature"
                defaultValue={25}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={25}
                max={45}
                />

            <span>
                Default pomodoro time
            </span>
            <Slider
                aria-label="Temperature"
                defaultValue={25}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={25}
                max={45}
                />

                <div className="btn btn-simple flex flex-center">Save</div>
        </div>
    );
}