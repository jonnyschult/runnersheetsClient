import React, { useState } from "react";
import classes from "../Club.module.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Form,
  Table,
} from "reactstrap";
import { Activity, User } from "../../../models";

interface CollatedWorkoutsProps {
  activities: Activity[];
  clubMembers: User[];
}

const CollatedWorkouts: React.FC<CollatedWorkoutsProps> = (props) => {
  const activities = props.activities;
  const clubMembers = props.clubMembers;
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} className={classes.collatedWorkoutsModal}>
          Generate
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName={`${classes.sheetModal}`}
        className={`${classes.modal} print`}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>Collated Workouts</header>
        </ModalHeader>
        <ModalBody className={classes.modalBodyWide}>
          {clubMembers.map((clubMember, index) => {
            return (
              <>
                <h5>{`${clubMember.first_name} ${clubMember.last_name}`}</h5>
                <Table className={classes.table} key={index}>
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
                    {activities
                      .filter((activity) => activity.user_id === clubMember.id)
                      .map((activity, index) => {
                        return (
                          <tr className={classes.tr} key={index}>
                            <th scope="row">{index + 1}</th>
                            <td className={classes.td}>
                              {new Date(+activity.date).toDateString()}
                            </td>
                            <td className={classes.td}>
                              {activity.distance_meters
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
                                ? activity.elevation_meters
                                : "--"}
                            </td>
                            <td className={classes.td}>
                              {activity.avg_hr ? activity.avg_hr : "--"}
                            </td>
                            <td className={classes.td}>
                              {activity.max_hr ? activity.max_hr : "--"}
                            </td>
                            <td className={classes.td}>
                              {activity.description
                                ? activity.description
                                : "--"}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={toggle}
            className={`modalButton ${classes.modalBtn} ${classes.cancelBtn}`}
          >
            Okay
          </Button>
          <Button
            className={` modalButton ${classes.modalBtn} ${classes.cancelBtn}`}
            onClick={(e) => window.print()}
          >
            Print
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CollatedWorkouts;
