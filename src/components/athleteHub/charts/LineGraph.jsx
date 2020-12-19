import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const LineGraph = (props) => {
  const [data, setData] = useState({});
  const lineGraph = () => {
    let dates = props.runs.map((run) => {
      return new Date(parseInt(run.date)).toDateString();
    });
    let distances = props.runs.map((run) => {
      return run.meters;
    });
    setData({
      labels: dates.reverse(),
      datasets: [
        {
          label: "Meters",
          data: distances.reverse(),
          backgroundColor: ["cornflowerblue"],
          borderWidth: 4,
        },
      ],
    });
  };

  useEffect(() => {
    lineGraph();
    console.log(props.runs);
  }, [props.runs]);
  return (
    <div className="lineGraph">
      <div>
        <Line data={data} />
      </div>
    </div>
  );
};

export default LineGraph;
