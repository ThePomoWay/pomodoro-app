import { Done, Label } from "@material-ui/icons";
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
        <div className={`${styles['container']} popover`}>
            <div className="popover-title">Select a priority</div>
            {[...Array(priorities.length - 1)].map((item, index) => (
                <div key={'priority'+index} className={`${styles['priority']} popover-icon-item ${(selected === (index+1)) && "popover-normal-item-selected"}`}
                     onClick={(e) => onPriorityClick(index+1)}>
                         <svg width="16" height="16" viewBox="0 0 12 12" style={{fill:priorities[index+1]}} xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.19796 1.17871C3.16301 1.17871 3.54238 1.93745 3.39715 2.12571V6.90102C4.35223 5.62759 5.38689 5.83982 5.78484 6.10512C6.10319 6.10512 6.71338 6.63572 6.97868 6.90102C8.25211 7.21938 9.26024 6.37057 9.52554 6.10527V1.72771L8.09481 2.31682C7.45809 2.31682 6.46326 1.57669 6.19796 1.17871Z"/>
                            <path d="M4.31902 6.20528C4.21491 6.28695 4.0643 6.26874 3.98262 6.16462C3.90095 6.06051 3.91915 5.90991 4.02326 5.82824C4.71535 5.28536 5.71268 5.34151 6.34004 5.96834C7.19898 6.82644 8.59649 6.82644 9.45451 5.96843C9.49706 5.92588 9.5208 5.86855 9.5208 5.80856V2.08239C9.5208 1.99087 9.4657 1.90843 9.38129 1.87335C9.29678 1.83833 9.19954 1.85772 9.13469 1.92257C8.45225 2.60447 7.34255 2.60465 6.65996 1.9226C5.80102 1.0645 4.40394 1.06448 3.54504 1.92295C3.503 1.96478 3.4792 2.02229 3.4792 2.08239V11.3844C3.4792 11.5167 3.37193 11.624 3.2396 11.624C3.10727 11.624 3 11.5167 3 11.3844V2.08239C3 1.89506 3.07442 1.71519 3.20669 1.58362C4.25228 0.53854 5.95258 0.538537 6.99866 1.58359C7.49413 2.07867 8.30062 2.07857 8.79591 1.58368C8.9977 1.38188 9.30108 1.3214 9.56496 1.43077C9.82825 1.54017 10 1.7971 10 2.08239V5.80856C10 5.99564 9.92578 6.17487 9.79336 6.30729C8.74823 7.35242 7.04743 7.35241 6.00135 6.30735C5.54595 5.85234 4.82101 5.81151 4.31902 6.20528Z"/>
                        </svg>

                    
                    <span>Priority {index + 1}</span>
                    {selected === index+1 && (<Done className="popover-select-tick" />)}
                </div>
            ))}
        </div>
    )
}