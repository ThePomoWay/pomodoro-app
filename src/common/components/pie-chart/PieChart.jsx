import {Chart, ArcElement, Tooltip} from 'chart.js'
import { useSelector } from 'react-redux';
import { selectStats } from '../../state/selectors';
import { getChartData } from '../../utils/chart-utils';
import { Pie } from 'react-chartjs-2';
import React  from "react";

Chart.register(ArcElement, Tooltip);

function PieChart(props) {
    let stats = useSelector(selectStats)
    let chartData = getChartData(stats);

    return (
        <Pie data={chartData}/>
    )
}

export default React.memo(PieChart)