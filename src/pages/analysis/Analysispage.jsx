import { FlashOn, FlashOnOutlined, Info } from "@material-ui/icons";
import { useEffect } from "react";
import Navbar from "../../common/components/navbar/navbar";
import { TabsComponent } from "../../common/components/tabs-component/TabsComponent";
import styles from './Analysispage.module.scss';

const tabs = [
    {
        title: 'Daily'
    },
    {
        title: 'Weekly'
    },
    {
        title: 'Monthly'
    }
]

export default function AnalysisPage(props) {
    useEffect(() => {
        //getStats();
    });

    return (
        <div className={styles['container']}>
            <Navbar selected="2" />
            <div className={styles['main-view']}>
                <div className={styles['analysis-container']}>
                    <div className={styles['streaks']}>
                        <h2 className="font-heading">Streaks</h2>
                        <p className="font-info">How to maintain a streak? <Info /></p>
                        <div className={styles['streak-container']}>
                            <div className={styles['longest-streak']}>
                                <h3 className="font-big">12 <FlashOn /> </h3>
                                <p className="font-info flex flex-center">Your longest streak</p>
                            </div>
                            <div className={styles['current-streak']}>
                                <h3 className="font-big">08 <FlashOnOutlined /> </h3>
                                <p className="font-info flex flex-center">Your current streak</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles['stats']}>
                        <h2 className="font-heading">Stats</h2>

                        <TabsComponent tabs={tabs} />
                    </div>
                </div>
            </div>
        </div>
    )
}