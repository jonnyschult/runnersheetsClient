import React from "react";
import classes from "./Charts.module.css";
import DistanceBarChart from "./DistanceBarChart";
import ElevationLineGraph from "./ElevationLineGraph";
import Doughnut from "./DistanceDoughnut";
import PolarChart from "./DaysPolar";
import { Container } from "reactstrap";
import { Activity } from "../../models";

interface ChartsAndGraphsProps {
  runs: Activity[];
}

const ChartsAndGraphs: React.FC<ChartsAndGraphsProps> = (props) => {
  // const [timeRan, setTimeRan] = useState<number>();
  // const [distanceCovered, setDistanceCovered] = useState<number>();
  // const [loading, setLoading] = useState<boolean>(true);

  // /**********************
  // SET DISTANCE AND DURATION
  // **********************/
  // useEffect(() => {
  //   let time = 0;
  //   let distance = 0;
  //   props.runs.forEach((run) => {
  //     time += run.duration_seconds;
  //     distance += run.distance_meters;
  //   });
  //   setTimeRan(time);
  //   setDistanceCovered(distance);
  //   setLoading(false);
  // }, [props.runs]);

  return (
    <div className={classes.mainDiv}>
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
    </div>
  );
};

export default ChartsAndGraphs;
