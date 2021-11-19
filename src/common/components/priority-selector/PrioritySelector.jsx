import { Label } from "@material-ui/icons";
import { useCallback } from "react";
import { priorityColorMap } from "../../utils/constants";
import styles from './PrioritySelector.module.scss';    


export function PrioritySelector(props) {
    let priorities = priorityColorMap;

    let selected = props.priority;

    const onPriorityClick = useCallback((item) => {
        props.onChange && props.onChange(item);
    })

    return (
        <div className={styles['container']}>
            {[...Array(priorities.length - 1)].map((item, index) => (
                <div key={'priority'+index} className={`${styles['priority']} ${(selected === (index+1)) && styles['selected']}`}
                     onClick={(e) => onPriorityClick(index+1)}>
                    <Label style={{fill: priorities[index+1]}} />
                    <span>Priority {index + 1}</span>
                </div>
            ))}
        </div>
    )
}