import React, { useEffect, useState } from "react";
import classes from "./Charts.module.css";
import { Line } from "react-chartjs-2";

const ElevationLineGraph = (props) => {
  const [data, setData] = useState({});
  const lineGraphSetter = () => {
    let dates = props.runs.map((run) => {
      return new Date(parseInt(run.date)).toDateString();
    });
    let elevations = props.runs.map((run) => {
      if (!run.elevationMeters) {
        return 0;
      }
      return run.elevationMeters;
    });
    setData({
      labels: dates.reverse(),
      datasets: [
        {
          label: "Meters",
          data: elevations.reverse(),
          backgroundColor: "rgb(83, 83, 83,)",
          pointBackgroundColor: "rgb(43, 43, 43, 1)",
          hoverBorderColor: "rgb(255, 155, 0)",
          hoverBorderWidth: 40,
        },
      ],
    });
  };

  useEffect(() => {
    lineGraphSetter();
  }, [props.runs]);
  return (
    <div className={classes.lineGraph}>
      <div>
        <Line data={data} />
      </div>
    </div>
  );
};

export default ElevationLineGraph;
