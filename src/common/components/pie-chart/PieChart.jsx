import { ArcElement, Chart, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { selectTheme } from "../../state/selectors";
import { getOriginFromUrl } from "../../utils/common";
import { THEME_DARK } from "../../utils/constants";

Chart.register(ArcElement, Tooltip);

function PieChart(props) {
  let theme = useSelector(selectTheme);
  let chartData = props.chartData;
  if (chartData && chartData.length) {
    if (chartData.length > 7) {
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
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  return context.label + " " + context.raw + "%";
                },
              },
            },
          },
        }}
        data={{
          datasets: [
            {
              data: chartData.map((item) => item.percent),
              backgroundColor: [
                "#003f5c",
                "#374c80",
                "#7a5195",
                "#bc5090",
                "#ef5675",
                "#ff764a",
                "#ffa600",
              ],
              borderColor: theme === THEME_DARK ? "rgb(18,18,18)" : "#fff",
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
