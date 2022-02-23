import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
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
