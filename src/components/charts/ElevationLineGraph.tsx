import React, { useEffect, useState } from "react";
import classes from "./Charts.module.css";
import { Line } from "react-chartjs-2";
import { Activity } from "../../models";

interface ElevationLineGraphProps {
  runs: Activity[];
}

const ElevationLineGraph: React.FC<ElevationLineGraphProps> = (props) => {
  const [data, setData] = useState<any>({});
  const [options, setOptions] = useState<any>();
  const lineGraphSetter = () => {
    let dates = props.runs.map((run) => {
      return new Date(parseInt(run.date)).toDateString();
    });
    let elevations = props.runs.map((run) => {
      if (!run.elevation_meters) {
        return 0;
      }
      return run.elevation_meters;
    });
    setData({
      labels: dates.reverse(),
      datasets: [
        {
          label: "Elevation in Meters",
          data: elevations.reverse(),
          backgroundColor: "rgb(83, 83, 83,)",
          pointBackgroundColor: "rgb(43, 43, 43, 1)",
          hoverBorderColor: "rgb(255, 155, 0)",
          hoverBorderWidth: 40,
        },
      ],
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
  };

  useEffect(() => {
    lineGraphSetter();
  }, [props.runs]);
  return (
    <div className={classes.lineGraph}>
      <div>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ElevationLineGraph;
