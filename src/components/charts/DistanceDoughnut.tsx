import React, { useEffect, useState } from "react";
import classes from "./Charts.module.css";
import { Doughnut } from "react-chartjs-2";
import { Activity } from "../../models";

interface DoughnutChartProps {
  runs: Activity[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = (props) => {
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});

  const doughnutChartSetter = () => {
    let durations = [0, 0, 0, 0, 0, 0, 0];
    props.runs.forEach((run) => {
      if (run.duration_seconds < 1200) durations[0]++;
      else if (run.duration_seconds < 2400) durations[1]++;
      else if (run.duration_seconds < 3600) durations[2]++;
      else if (run.duration_seconds < 4800) durations[3]++;
      else if (run.duration_seconds < 6000) durations[4]++;
      else if (run.duration_seconds < 7200) durations[5]++;
      else if (run.duration_seconds >= 7200) durations[6]++;
    });
    setOptions({
      cutoutPercentage: 65,
      rotation: 4.73,
    });
    setData({
      labels: [
        "0-20 minutes",
        "20-40 minutes",
        "40-60 minutes",
        "60-80 minutes",
        "80-100 minutes",
        "100-120 minutes",
        "2 hour+",
      ],
      datasets: [
        {
          data: durations,
          label: "Duration of Runs",
          backgroundColor: [
            "yellow",
            "green",
            "blue",
            "indigo",
            "violet",
            "red",
            "orange",
          ],
          borderWidth: 4,
        },
      ],
    });
  };

  useEffect(() => {
    doughnutChartSetter();
  }, [props.runs]);
  return (
    <div className={classes.doughnut}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
