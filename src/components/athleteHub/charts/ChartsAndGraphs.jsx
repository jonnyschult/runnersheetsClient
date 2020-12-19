import React, { useEffect, useState } from "react";
import APIURL from "../../../helpers/environment";
import classes from "./Charts.module.css";
import LineGraph from "./LineGraph";
import { Container, Spinner } from "reactstrap";

const ChartsAndGraphs = (props) => {
  const [loadingMain, setLoadingMain] = useState(false);
  const [timeRan, setTimeRan] = useState();
  const [distanceCovered, setDistanceCovered] = useState();
  const [loading, setLoading] = useState(true);

  /**********************
  SET DISTANCE AND DURATION
  **********************/
  useEffect(async () => {
    let time = 0;
    let distance = 0;
    await props.runs.forEach((run) => {
      time += run.durationSecs;
      distance += run.meters;
    });
    await setTimeRan(time);
    await setDistanceCovered(distance);
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
            <LineGraph runs={props.runs} />
          </Container>
          <Container className={classes.middleCharts}>
            <div>
              <h4>
                {loading ? (
                  <Spinner />
                ) : (
                  `Time Ran: ${new Date(timeRan * 1000)
                    .toISOString()
                    .substr(11, 8)}`
                )}
              </h4>
              <h4>
                {loading ? (
                  <Spinner />
                ) : (
                  `Distance:
                ${(distanceCovered / 1000)
                  .toFixed(2)
                  .toString()
                  .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} kms`
                )}
              </h4>
            </div>
          </Container>
          <Container className={classes.bottomCharts}></Container>
        </div>
      )}
    </div>
  );
};

export default ChartsAndGraphs;
