import React, { useEffect, useState } from "react";
import classes from "./Charts.module.css";
import { Polar } from "react-chartjs-2";

const PolarChart = (props) => {
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});

  const polarChartSetter = () => {
    let days = [0, 0, 0, 0, 0, 0, 0];
    props.runs.forEach((run) => {
      switch (new Date(parseInt(run.date)).toDateString().substr(0, 3)) {
        case "Sun":
          days[0]++;
          break;
        case "Mon":
          days[1]++;
          break;
        case "Tue":
          days[2]++;
          break;
        case "Wed":
          days[3]++;
          break;
        case "Thu":
          days[4]++;
          break;
        case "Fri":
          days[5]++;
          break;
        case "Sat":
          days[6]++;
          break;
      }
    });
    // setOptions({
    //   aspectRation: 27,
    // });
    setData({
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          data: days,
          label: "Most Active Days of the Week",
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
    polarChartSetter();
  }, [props.runs]);
  return (
    <div className={classes.polar}>
      <Polar data={data} options={options} />
    </div>
  );
};

export default PolarChart;
