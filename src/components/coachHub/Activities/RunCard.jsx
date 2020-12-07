import React from "react";
import ActivitiesModal from "./ActivitiesModal";
import classes from "../Coach.module.css";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Table,
  CardHeader,
} from "reactstrap";

function timeConverter(seconds) {
  let remainingSecs = seconds % 60;
  let minutes = Math.floor(seconds / 60);
  let time = minutes + remainingSecs / 100;
  return time.toFixed(2);
}

const RunCard = (props) => {
  const activities = props.athlete.activities.sort(
    //Sorts runs by date in descending order
    (runA, runB) => runB.date - runA.date
  );

  return (
    <div>
      <Card className={classes.middleContainerCard}>
        <CardHeader className={classes.middleContainerCardHeader}>
          <CardTitle className={classes.middleContainerCardTitle}>
            {`${props.athlete.firstName} ${props.athlete.lastName}`}
          </CardTitle>
        </CardHeader>
        <CardBody className={classes.middleContainerCardBody}>
          <Table className={classes.table}>
            <thead className={classes.thead}>
              <tr className={classes.tr}>
                <th className={classes.th}>#</th>
                <th className={classes.th}>Date</th>
                <th className={classes.th}>Meters</th>
                <th className={classes.th}>Time</th>
                <th className={classes.th}>Pace</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => {
                return (
                  <tr key={index} className={`${classes.tr}`}>
                    <th scope="row">{index + 1}</th>
                    <td className={classes.td}>
                      {new Date(parseInt(activity.date)).toDateString()}
                    </td>
                    <td className={classes.td}>
                      {Math.floor(activity.meters)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td className={classes.td}>
                      {new Date(activity.durationSecs * 1000)
                        .toISOString()
                        .substr(11, 8)}
                    </td>
                    {/* prettier-ignore */}
                    <td className={classes.td}>{new Date(
                        (activity.durationSecs / (activity.meters / 1000)) *
                          1000
                      )
                        .toISOString()
                        .substr(11, 8)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <ActivitiesModal athlete={props.athlete} />
        </CardBody>
      </Card>
    </div>
  );
};

export default RunCard;
