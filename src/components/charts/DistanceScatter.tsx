import React, { useEffect, useState } from "react";
import classes from "./Charts.module.css";
import { Scatter } from "react-chartjs-2";
import moment from "react-moment";

const DistanceScatter = (props) => {
  const [data, setData] = useState({});
  const [options, setOptions] = useState();
  const ScatterSetter = () => {
    let colors = [
      "Blue ",
      "Red",
      "Green",
      "Orange",
      "Violet",
      "Indigo",
      "#FF33FF",
      "#FFFF99",
      "Yellow ",
      "#00B3E6",
      "#E6B333",
      "#3366E6",
      "#999966",
      "#99FF99",
      "#B34D4D",
      "#80B300",
      "#809900",
      "#E6B3B3",
      "#6680B3",
      "#66991A",
      "#FF99E6",
      "#CCFF1A",
      "#FF1A66",
      "#E6331A",
      "#FF6633",
      "#FFB399",
      "#33FFCC",
      "#66994D",
      "#B366CC",
      "#4D8000",
      "#B33300",
      "#CC80CC",
      "#66664D",
      "#991AFF",
      "#E666FF",
      "#4DB3FF",
      "#1AB399",
      "#E666B3",
      "#33991A",
      "#CC9999",
      "#B3B31A",
      "#00E680",
      "#4D8066",
      "#809980",
      "#E6FF80",
      "#1AFF33",
      "#999933",
      "#FF3380",
      "#CCCC00",
      "#66E64D",
      "#4D80CC",
      "#9900B3",
      "#E64D66",
      "#4DB380",
      "#FF4D4D",
      "#99E6E6",
      "#6666FF",
    ];

    let athleteData = props.teamActivities.map((athlete, index) => {
      return {
        label: `${athlete.firstName} ${athlete.lastName}`,
        data: athlete.activities.map((activity) => {
          return {
            x: parseInt(activity.date),
            y: activity.meters,
          };
        }),
        pointBackgroundColor: colors[index],
        backgroundColor: colors[index],
        borderColor: colors[index],
        hoverBorderColor: colors[index],
        hoverBackgroundColor: "rgb(255, 155, 0)",
        hoverBorderWidth: 40,
        showLine: true,
        lineTension: 0.3,
        fill: false,
      };
    });

    setOptions({
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            let label = [
              new Date(tooltipItem.xLabel).toLocaleDateString("en-US"),
              `Meters: ${Math.floor(tooltipItem.yLabel)}`,
            ];
            return label;
          },
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              source: "data",
              autoSkiip: false,
              callback: (value) =>
                new Date(parseInt(value)).toISOString().substr(0, 10),
            },
          },
        ],
      },
    });

    setData({
      labels: "Y axis = distance in meters",
      datasets: athleteData,
    });
  };

  useEffect(() => {
    ScatterSetter();
  }, [props.teamActivities]);

  return (
    <div className={classes.lineGraph}>
      <div>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};

export default DistanceScatter;
