import React, { useState } from "react";
import classes from "../Athlete.module.css";
import UpdateModal from "./UpdateModal";
import { Table } from "reactstrap";

const ActivitiesModal = (props) => {
  const [expand, setExpand] = useState(true);

  const toggle = () => setExpand(!expand);

  const metersAdder = (arr) => {
    let totalNum = 0;
    arr.forEach((run) => (totalNum += run.meters));
    return totalNum;
  };

  const timeAdder = (arr) => {
    let totalNum = 0;
    arr.forEach((run) => (totalNum += run.durationSecs));
    return totalNum;
  };

  const elevationAdder = (arr) => {
    let totalNum = 0;
    let counter = 0;
    arr.forEach((run) => {
      if (typeof run.elevationMeters === "number")
        totalNum += run.elevationMeters;
      counter++;
    });
    return { total: totalNum, average: totalNum / counter };
  };

  const avgHRAdder = (arr) => {
    let totalNum = 0;
    let counter = 0;
    arr.forEach((run) => {
      if (typeof run.avgHR === "number") totalNum += run.avgHR;
      counter++;
    });
    return totalNum / counter;
  };

  const maxHRAdder = (arr) => {
    let totalNum = 0;
    let counter = 0;
    arr.forEach((run) => {
      if (typeof run.maxHR === "number") {
        totalNum += run.maxHR;
        counter++;
      }
    });
    return totalNum / counter;
  };

  return (
    <div className={classes.tableContainer}>
      {props.runs ? (
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
            {props.runs.map((run, index) => {
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
                      {new Date(parseInt(run.date)).toDateString()}
                    </td>
                    <td className={classes.td}>
                      {Math.floor(run.meters)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td className={classes.td}>
                      {new Date(run.durationSecs * 1000)
                        .toISOString()
                        .substr(11, 8)}
                    </td>
                    <td className={classes.td}>
                      {new Date((run.durationSecs / (run.meters / 1000)) * 1000)
                        .toISOString()
                        .substr(11, 8)}
                    </td>
                    <td className={classes.td}>
                      {run.elevationMeters
                        ? Math.round(run.elevationMeters)
                        : "--"}
                    </td>
                    <td className={classes.td}>
                      {run.avgHR ? run.avgHR : "--"}
                    </td>
                    <td className={classes.td}>
                      {run.maxHR ? run.maxHR : "--"}
                    </td>
                    <td className={classes.td}>
                      {run.description ? (
                        <>
                          <p className={classes.descriptionExpander}>more...</p>
                          <div className={classes.runDescription}>
                            {run.description}
                          </div>
                        </>
                      ) : (
                        "--"
                      )}
                    </td>
                    <td>
                      <UpdateModal
                        run={run}
                        setUpdate={props.setUpdate}
                        token={props.token}
                      />
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
          {props.runs.length > 0 ? (
            <tfoot className={classes.tfoot}>
              <tr className={`${classes.tr} ${classes.totals}`}>
                <th>Totals</th>
                <td className={classes.td}>
                  {new Date(parseInt(props.runs[0].date))
                    .toDateString()
                    .substr(4, 6)}{" "}
                  -
                  {new Date(parseInt(props.runs[props.runs.length - 1].date))
                    .toDateString()
                    .substr(4, 6)}
                </td>
                <td className={classes.td}>
                  {Math.floor(metersAdder(props.runs))
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {new Date(timeAdder(props.runs) * 1000)
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>N/A</td>
                <td className={classes.td}>
                  {Math.floor(elevationAdder(props.runs).total)
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
                  {new Date(parseInt(props.runs[0].date))
                    .toDateString()
                    .substr(4, 6)}{" "}
                  -
                  {new Date(parseInt(props.runs[props.runs.length - 1].date))
                    .toDateString()
                    .substr(4, 6)}
                </td>
                <td className={classes.td}>
                  {Math.floor(metersAdder(props.runs) / props.runs.length)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {new Date((timeAdder(props.runs) * 1000) / props.runs.length)
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>
                  {new Date(
                    (timeAdder(props.runs) / (metersAdder(props.runs) / 1000)) *
                      1000
                  )
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>
                  {Math.floor(elevationAdder(props.runs).average)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {Math.floor(avgHRAdder(props.runs))}
                </td>
                <td className={classes.td}>
                  {Math.floor(maxHRAdder(props.runs))}
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
      {props.runs.length > 8 ? (
        <p className={classes.expand} onClick={(e) => toggle()}>
          {expand ? "More" : "Less"}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ActivitiesModal;
