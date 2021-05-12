import React, { useState } from "react";
import classes from "../Athlete.module.css";
import UpdateModal from "./UpdateModal";
import { Table } from "reactstrap";
import { Activity, UserInfo } from "../../../models";
import {
  avgHRAdder,
  elevationAdder,
  maxHRAdder,
  metersAdder,
  timeAdder,
} from "../../../utilities";

interface RunTableProps {
  userInfo: UserInfo;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const RunTable: React.FC<RunTableProps> = (props) => {
  const [expand, setExpand] = useState(true);

  const toggle = () => setExpand(!expand);

  return (
    <div className={classes.tableContainer}>
      {props.activities ? (
        <Table className={classes.table}>
          <thead className={classes.thead}>
            <tr className={classes.trHead}>
              <th className={classes.th}>#</th>
              <th className={classes.th}>Date</th>
              <th className={classes.th}>Meters</th>
              <th className={classes.th}>Time</th>
              <th className={classes.th}>Pace km</th>
              <th className={classes.th}>Elevation/m</th>
              <th className={classes.th}>Average HR</th>
              <th className={classes.th}>Max HR</th>
              <th className={classes.th}>Description</th>
              <th className={classes.th}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {props.activities.map((activity, index) => {
              return (
                <>
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
                      {new Date(activity.date).toDateString()}
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
                    <td className={classes.td}>
                      {new Date(
                        (activity.duration_seconds /
                          (activity.distance_meters / 1000)) *
                          1000
                      )
                        .toISOString()
                        .substr(11, 8)}
                    </td>
                    <td className={classes.td}>
                      {activity.elevation_meters
                        ? Math.round(activity.elevation_meters)
                        : "--"}
                    </td>
                    <td className={classes.td}>
                      {activity.avg_hr ? activity.avg_hr : "--"}
                    </td>
                    <td className={classes.td}>
                      {activity.max_hr ? activity.max_hr : "--"}
                    </td>
                    <td className={classes.td}>
                      {activity.description ? (
                        <>
                          <p className={classes.descriptionExpander}>more...</p>
                          <div className={classes.activityDescription}>
                            {activity.description}
                          </div>
                        </>
                      ) : (
                        "--"
                      )}
                    </td>
                    <td>
                      <UpdateModal
                        userInfo={props.userInfo}
                        activity={activity}
                        activities={props.activities}
                        setActivities={props.setActivities}
                      />
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
          {props.activities.length > 0 ? (
            <tfoot className={classes.tfoot}>
              <tr className={`${classes.tr} ${classes.totals}`}>
                <th>Totals</th>
                <td className={classes.td}>
                  {new Date(props.activities[0].date)
                    .toDateString()
                    .substr(4, 6)}{" "}
                  -
                  {new Date(props.activities[props.activities.length - 1].date)
                    .toDateString()
                    .substr(4, 6)}
                </td>
                <td className={classes.td}>
                  {Math.floor(metersAdder(props.activities))
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {new Date(timeAdder(props.activities) * 1000)
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>N/A</td>
                <td className={classes.td}>
                  {Math.floor(elevationAdder(props.activities).total)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>N/A</td>
                <td className={classes.td}>N/A</td>
                <td className={classes.td}>N/A</td>
                <td></td>
              </tr>
              <tr className={`${classes.tr} ${classes.averages}`}>
                <th>Averages</th>
                <td className={classes.td}>
                  {new Date(props.activities[0].date)
                    .toDateString()
                    .substr(4, 6)}{" "}
                  -
                  {new Date(props.activities[props.activities.length - 1].date)
                    .toDateString()
                    .substr(4, 6)}
                </td>
                <td className={classes.td}>
                  {Math.floor(
                    metersAdder(props.activities) / props.activities.length
                  )
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {new Date(
                    (timeAdder(props.activities) * 1000) /
                      props.activities.length
                  )
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>
                  {new Date(
                    (timeAdder(props.activities) /
                      (metersAdder(props.activities) / 1000)) *
                      1000
                  )
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>
                  {Math.floor(elevationAdder(props.activities).average)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {Math.floor(avgHRAdder(props.activities))}
                </td>
                <td className={classes.td}>
                  {Math.floor(maxHRAdder(props.activities))}
                </td>
                <td className={classes.td}>N/A</td>
                <td></td>
              </tr>
            </tfoot>
          ) : (
            <></>
          )}
        </Table>
      ) : (
        <p>Enter data or change dates to see activites.</p>
      )}
      {props.activities.length > 8 ? (
        <p className={classes.expand} onClick={(e) => toggle()}>
          {expand ? "More" : "Less"}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default RunTable;
