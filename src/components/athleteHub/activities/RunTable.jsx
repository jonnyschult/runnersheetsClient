import React, { useState } from "react";
import classes from "../Athlete.module.css";
import UpdateModal from "./UpdateModal";
import { Button, Table } from "reactstrap";

const ActivitiesModal = (props) => {
  return (
    <div>
      {props.runs ? (
        <Table className={classes.table}>
          <thead className={classes.thead}>
            <tr className={classes.tr}>
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
                  <tr className={classes.tr} key={index}>
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
                      {run.elevationMeters ? run.elevationMeters : "--"}
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
        </Table>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ActivitiesModal;
