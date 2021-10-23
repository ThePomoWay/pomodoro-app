import React, { useCallback, useState } from "react";

import styles from "./estimatedPomos.module.scss";

export default (props) => {
    let defaultPomos = Number(props.default) || 5;
    let [checkedPomos, setCheckedPomos] = useState(-1);
    let [hoverPomos, setHoverPomos] = useState(-1);

    let onHover = useCallback((i) => {
        setHoverPomos(i)
    });

    let onMouseLeave = useCallback(() => {
        setHoverPomos(-1);
    });
    
    let onClick = useCallback((i) => {
        setCheckedPomos(i);
        props.onClick && props.onClick(i);
    })
    return (
        <span className="w-100 flex">
            {[...Array(defaultPomos)].map((e, i) => (<div 
                                                        key={i}
                                                        className={`${styles.item} circle ${(i <= checkedPomos || i <= hoverPomos) ? 'circle-filled' : ''}`} 
                                                        onMouseEnter={() => onHover(i)}
                                                        onMouseLeave={() => onMouseLeave()}
                                                        onClick={() => onClick(i)}></div>))}
        </span>
    );
}