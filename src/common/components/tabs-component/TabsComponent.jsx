import { useState } from "react";
import styles from './TabsComponent.module.scss';

export function TabsComponent(props) {

    let tabs = props.tabs;
    let [selectedTab, setSelectedTab] = useState(props.selected || 0)

    return (
        <div className={styles['tabs']}>
            {tabs.map((item, index) => (
                <div className={`${styles['tab']} ${selectedTab === index && styles['selected']}`} 
                     key={'tab#'+index+item.title}
                     onClick={(e) => {setSelectedTab(index); props.onClick && props.onClick(index)}}>
                    {item.title}
                </div>
            ))}
        </div>
    );
}