import React, { useCallback, useEffect, useState } from "react";
import classes from "./Charts.module.css";
import { Bar } from "react-chartjs-2";
import { Activity } from "../../models";

interface DistanceBarChartProps {
  runs: Activity[];
}

const DistanceBarChart: React.FC<DistanceBarChartProps> = (props) => {
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});

  const barChartSetter = useCallback(() => {
    let dates = props.runs.map((run) => {
      return new Date(run.date).toDateString();
    });
    let distances = props.runs.map((run) => {
      return run.distance_meters;
    });
    setOptions({
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: 0,
            },
          },
        ],
      },
    });
    setData({
      labels: dates.reverse(),
      datasets: [
        {
          maxBarThickness: 125,
          label: "Distance in Meters",
          data: distances.reverse(),
          backgroundColor: "rgb(41, 41, 43,)",
          hoverBackgroundColor: "rgb(41, 41, 43,)",
          hoverBorderColor: "rgb(255, 155, 0)",
          hoverBorderWidth: 500,
        },
      ],
    });
  }, [props.runs]);

  useEffect(() => {
    barChartSetter();
  }, [barChartSetter]);
  return (
    <div className={classes.barChart}>
      <div>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DistanceBarChart;
