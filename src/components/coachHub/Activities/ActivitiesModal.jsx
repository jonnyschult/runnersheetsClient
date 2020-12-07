import React, { useState } from "react";
import classes from "../Coach.module.css";
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
                      {activity.meters
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
