import { Add } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";

import styles from "./estimatedPomos.module.scss";

export default (props) => {
    let [defaultPomos, setDefaultPomos] = useState(Number(props.default) || 5);
    let [checkedPomos, setCheckedPomos] = useState(-1);
    let [hoverPomos, setHoverPomos] = useState(-1);

    useEffect(() => {
        setCheckedPomos(props.value - 1);
    }, [props.value])

    let onHover = useCallback((i) => {
        setHoverPomos(i)
    });

    let onMouseLeave = useCallback(() => {
        setHoverPomos(-1);
    });
    
    let onClick = useCallback((i) => {
        setCheckedPomos(i);
        props.onClick && props.onClick(i+1);
    })
    let onAddClick = useCallback(() => {
        setDefaultPomos(defaultPomos + 1);
    })
    return (
        <span className="w-100 flex">
            {[...Array(defaultPomos)].map((e, i) => (<div 
                                                        key={i}
                                                        className={`${styles.item} circle flex flex-center ${(i <= checkedPomos || i <= hoverPomos) ? 'circle-filled' : ''}`} 
                                                        onMouseEnter={() => onHover(i)}
                                                        onMouseLeave={() => onMouseLeave()}
                                                        onClick={() => onClick(i)}>
                                                        {(i <= hoverPomos || i <= checkedPomos) && (i+1)}
                                                        </div>))}
            <span className={styles['add']} onClick={onAddClick}><Add style={{width: '16px', height: '16px'}} /></span>
        </span>
    );
}