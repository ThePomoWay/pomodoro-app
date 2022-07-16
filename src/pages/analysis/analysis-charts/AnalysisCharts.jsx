import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip
);

export function AnalysisCharts({ chartsData, minY }) {
  if (chartsData && Object.keys(chartsData).length > 0) {
    return (
      <div>
        <Line
          data={chartsData}
          options={{ scales: { y: { min: 0 } }, ticks: { precision: 0 } }}
        />
      </div>
    );
  }
  return <div></div>;
}

export function AnalysisBarCharts({ chartsData, minY }) {
  if (chartsData && Object.keys(chartsData).length > 0) {
    return (
      <div>
        <Bar
          data={chartsData}
          options={{ scales: { y: 
            { 
              min: 0,
              title: {
                display: true,
                text: "Time in Minutes"
              }
            } 
          }, ticks: { precision: 0 } }}
        />
      </div>
    );
  }
  return <div></div>;
}
