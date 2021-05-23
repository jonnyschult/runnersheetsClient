import React, { useState } from "react";
import ActivitiesModal from "./ActivitiesModal";
import classes from "../Coach.module.css";
import { Card, CardBody, CardTitle, Table, CardHeader } from "reactstrap";
import { Activity, User } from "../../../models";
import { timeAdder, metersAdder } from "../../../utilities";

interface RunCardProps {
  athlete: User;
  athleteActivities: Activity[];
}

const RunCard: React.FC<RunCardProps> = (props) => {
  const activities = props.athleteActivities.sort(
    //Sorts runs by date in descending order
    (runA, runB) =>
      new Date(runB.date).getTime() - new Date(runA.date).getTime()
  );
  const athlete = props.athlete;
  const [expand, setExpand] = useState(true);

  const toggle = () => setExpand(!expand);

  return (
    <div>
      <Card className={classes.middleContainerCard}>
        <CardHeader className={classes.middleContainerCardHeader}>
          <CardTitle className={classes.middleContainerCardTitle}>
            {`${athlete.first_name} ${athlete.last_name}`}
          </CardTitle>
        </CardHeader>
        <CardBody className={classes.middleContainerCardBody}>
          {activities.length > 0 ? (
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
                    <tr
                      className={
                        index > 7 && expand
                          ? `${classes.tr} ${classes.expandableTr}`
                          : classes.tr
                      }
                      key={index}
                    >
                      <th scope="row">{index + 1}</th>
                      <td className={classes.td}>
                        {new Date(+activity.date).toDateString()}
                      </td>
                      <td className={classes.td}>
                        {Math.floor(activity.distance_meters)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={classes.td}>
                        {new Date(activity.duration_seconds * 1000)
                          .toISOString()
                          .substr(11, 8)}
                      </td>
                      {/* prettier-ignore */}
                      <td className={classes.td}>{new Date(
                        (activity.duration_seconds / (activity.distance_meters / 1000)) *
                          1000
                      )
                        .toISOString()
                        .substr(11, 8)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className={classes.tfoot}>
                <tr className={`${classes.tr} ${classes.totals}`}>
                  <th>Totals</th>
                  <td className={classes.td}>
                    {new Date(+activities[0].date).toDateString().substr(4, 6)}{" "}
                    -
                    {new Date(+activities[activities.length - 1].date)
                      .toDateString()
                      .substr(4, 6)}
                  </td>
                  <td className={classes.td}>
                    {Math.floor(metersAdder(activities))
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td className={classes.td}>
                    {new Date(timeAdder(activities) * 1000)
                      .toISOString()
                      .substr(11, 8)}
                  </td>
                  <td className={classes.td}>N/A</td>
                </tr>
                <tr className={`${classes.tr} ${classes.averages}`}>
                  <th>Averages</th>
                  <td className={classes.td}>
                    {new Date(+activities[0].date).toDateString().substr(4, 6)}{" "}
                    -
                    {new Date(+activities[activities.length - 1].date)
                      .toDateString()
                      .substr(4, 6)}
                  </td>
                  <td className={classes.td}>
                    {Math.floor(metersAdder(activities) / activities.length)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td className={classes.td}>
                    {new Date(
                      (timeAdder(activities) * 1000) / activities.length
                    )
                      .toISOString()
                      .substr(11, 8)}
                  </td>
                  <td className={classes.td}>
                    {new Date(
                      (timeAdder(activities) /
                        (metersAdder(activities) / 1000)) *
                        1000
                    )
                      .toISOString()
                      .substr(11, 8)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          ) : (
            <></>
          )}
          {activities.length > 8 ? (
            <p className={classes.expand} onClick={(e) => toggle()}>
              {expand ? "Expand" : "Less"}
            </p>
          ) : (
            <></>
          )}
          <ActivitiesModal athlete={props.athlete} activities={activities} />
        </CardBody>
      </Card>
    </div>
  );
};

export default RunCard;
