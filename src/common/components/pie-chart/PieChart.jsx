import { ArcElement, Chart, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";
import { getOriginFromUrl } from "../../utils/common";

Chart.register(ArcElement, Tooltip);

function PieChart(props) {
  let chartData = props.chartData;
  if (chartData && chartData.length) {
    if (chartData.length > 7) {
      let others;
      chartData = [
        ...chartData.slice(0, 6),
        {
          text: "Others",
          timeSpent: chartData
            .slice(6)
            .reduce((a, item) => a + item.timeSpent, 0),
        },
      ];
    }
    return (
      <Pie
        options={{
          responsive: true,
        }}
        data={{
          datasets: [
            {
              data: chartData.map((item) => item.timeSpent / (1000 * 60)),
              backgroundColor: [
                "#003f5c",
                "#374c80",
                "#7a5195",
                "#bc5090",
                "#ef5675",
                "#ff764a",
                "#ffa600",
              ],
            },
          ],
          labels: chartData.map(
            (item) => (item.url && getOriginFromUrl(item.url)) || item.text
          ),
        }}
      />
    );
  }
  return <></>;
}

export default React.memo(PieChart);
