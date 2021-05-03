import React, { useState } from "react";
import classes from "../Club.module.css";
import ChartsAndGraphs from "../../charts/ChartsAndGraphs";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Form,
  Table,
} from "reactstrap";

const ActivitiesModal = (props) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

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
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} className={classes.activitiesModalButton}>
          More Info
        </Button>
      </Form>
      <Modal
        className={`${classes.modal} print`}
        isOpen={modal}
        toggle={toggle}
        contentClassName={`${classes.sheetModal}`}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>
            {`${props.athlete.firstName} ${props.athlete.lastName}`}{" "}
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBodyWide}>
          <ChartsAndGraphs runs={props.athlete.activities} />
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
              </tr>
            </thead>
            <tbody>
              {props.athlete.activities.map((activity, index) => {
                return (
                  <tr className={classes.tr} key={index}>
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
                    <td className={classes.td}>
                      {new Date(
                        (activity.durationSecs / (activity.meters / 1000)) *
                          1000
                      )
                        .toISOString()
                        .substr(11, 8)}
                    </td>
                    <td className={classes.td}>
                      {activity.elevationMeters
                        ? activity.elevationMeters
                        : "--"}
                    </td>
                    <td className={classes.td}>
                      {activity.avgHR ? activity.avgHR : "--"}
                    </td>
                    <td className={classes.td}>
                      {activity.maxHR ? activity.maxHR : "--"}
                    </td>
                    <td className={classes.td}>
                      {activity.description ? activity.description : "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className={classes.tfoot}>
              <tr className={`${classes.tr} ${classes.totals}`}>
                <th>Totals</th>
                <td className={classes.td}>
                  {new Date(parseInt(props.athlete.activities[0].date))
                    .toDateString()
                    .substr(4, 6)}{" "}
                  -
                  {new Date(
                    parseInt(
                      props.athlete.activities[
                        props.athlete.activities.length - 1
                      ].date
                    )
                  )
                    .toDateString()
                    .substr(4, 6)}
                </td>
                <td className={classes.td}>
                  {Math.floor(metersAdder(props.athlete.activities))
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {new Date(timeAdder(props.athlete.activities) * 1000)
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>N/A</td>
                <td className={classes.td}>
                  {Math.floor(elevationAdder(props.athlete.activities).total)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>N/A</td>
                <td className={classes.td}>N/A</td>
                <td className={classes.td}>N/A</td>
              </tr>
              <tr className={`${classes.tr} ${classes.averages}`}>
                <th>Averages</th>
                <td className={classes.td}>
                  {new Date(parseInt(props.athlete.activities[0].date))
                    .toDateString()
                    .substr(4, 6)}{" "}
                  -
                  {new Date(
                    parseInt(
                      props.athlete.activities[
                        props.athlete.activities.length - 1
                      ].date
                    )
                  )
                    .toDateString()
                    .substr(4, 6)}
                </td>
                <td className={classes.td}>
                  {Math.floor(
                    metersAdder(props.athlete.activities) /
                      props.athlete.activities.length
                  )
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {new Date(
                    (timeAdder(props.athlete.activities) * 1000) /
                      props.athlete.activities.length
                  )
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>
                  {new Date(
                    (timeAdder(props.athlete.activities) /
                      (metersAdder(props.athlete.activities) / 1000)) *
                      1000
                  )
                    .toISOString()
                    .substr(11, 8)}
                </td>
                <td className={classes.td}>
                  {Math.floor(elevationAdder(props.athlete.activities).average)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className={classes.td}>
                  {Math.floor(avgHRAdder(props.athlete.activities))}
                </td>
                <td className={classes.td}>
                  {Math.floor(maxHRAdder(props.athlete.activities))}
                </td>
                <td className={classes.td}>N/A</td>
              </tr>
            </tfoot>
          </Table>
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <div className={classes.btnGroup}>
            <Button
              className={` modalButton ${classes.modalBtn} ${classes.cancelBtn}`}
              onClick={toggle}
            >
              Cancel
            </Button>
            <Button
              className={` modalButton ${classes.modalBtn} ${classes.printBtn}`}
              onClick={(e) => window.print()}
            >
              Print
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ActivitiesModal;
