import React, { useEffect, useState } from "react";
import classes from "./Charts.module.css";
import DistanceBarChart from "./DistanceBarChart";
import ElevationLineGraph from "./ElevationLineGraph";
import Doughnut from "./DistanceDoughnut";
import PolarChart from "./DaysPolar";
import { Container, Spinner } from "reactstrap";

const ChartsAndGraphs = (props) => {
  const [loadingMain, setLoadingMain] = useState(false);
  const [timeRan, setTimeRan] = useState();
  const [distanceCovered, setDistanceCovered] = useState();
  const [loading, setLoading] = useState(true);

  /**********************
  SET DISTANCE AND DURATION
  **********************/
  useEffect(() => {
    let time = 0;
    let distance = 0;
    props.runs.forEach((run) => {
      time += run.durationSecs;
      distance += run.meters;
    });
    setTimeRan(time);
    setDistanceCovered(distance);
    setLoading(false);
  }, [props.runs]);

  return (
    <div className={classes.mainDiv}>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <div>
          <h5>Charts and Graphs</h5>
          <Container className={classes.topCharts}>
            <DistanceBarChart runs={props.runs} />
            <ElevationLineGraph runs={props.runs} />
            <div className={classes.polarDoughnut}>
              <Doughnut runs={props.runs} />
              <PolarChart runs={props.runs} />
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default ChartsAndGraphs;
