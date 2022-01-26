import { useCallback, useEffect, useState } from "react";
import styles from "./TaskDescription.module.scss"

export default function TaskDescription(props) {
    let isBulleted = props.isBulleted;

    let [value, setValue] = useState(props.value || '');
    let [noLines, setNoLines] = useState(0);
    let initialLastVal = '';
    let splitVal = []
    if(props.value) {
        splitVal = props.value.split('\n');
        noLines = splitVal.length;
    }
    let [lastLine, setLastLine] = useState(splitVal[splitVal.length - 1] || '');

    let onKeyDownBullet = useCallback((e) => {
        if(e.code === 'Enter' && lastLine.length > 0) {
            if(noLines === 0) {
                setValue(lastLine + '\n');
            }
            else {
                setValue(value + lastLine + '\n')
            }

            setLastLine('');

            setNoLines(noLines + 1);
        }
        if(e.code === 'Backspace' && lastLine.length === 0) {
            let splitLine = value.split('\n');
            if(splitLine.length > 1) {
                setValue(splitLine.slice(0,-1).join('\n'));
                setLastLine(splitLine[splitLine.length - 2]);
                setNoLines(noLines - 1);
            }
        }
    })

    let onChangeBullet = useCallback((e) => {
        setLastLine(e.target.value);
        props.onChange && props.onChange(value + e.target.value);
    })

    let onChangeValue = useCallback((e) => {
        setValue(e.target.value);
        props.onChange && props.onChange(value);
    })
    if(isBulleted) {
        let splitValue = value.split('\n');
        return (
            <div className={styles['description-bullet']}>
                {splitValue.map((item, index) => (
                    <div className={styles.descitem} key={index}>
                        <span className={styles.bullet}></span>
                        {index !== (splitValue.length-1) && (
                            <span>{item}</span>
                        ) || (
                            <input autoFocus className={styles['desc-input']} onChange={onChangeBullet} onKeyDown={onKeyDownBullet} value={lastLine} />
                        )}
                        
                    </div>
                ))}
            </div>
        )
    }
    return (
        <div className={styles['description-value']}>
            <textarea placeholder="This is some Tech term that I don't understand" className={styles['desc-input']} onChange={onChangeValue} value={value} />
        </div>
    )
}