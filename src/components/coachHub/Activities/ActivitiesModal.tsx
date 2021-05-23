import React, { useState } from "react";
import classes from "../Coach.module.css";
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
import { Activity, User } from "../../../models";
import {
  timeAdder,
  metersAdder,
  elevationAdder,
  avgHRAdder,
  maxHRAdder,
} from "../../../utilities";

interface ActivitiesModalProps {
  athlete: User;
  activities: Activity[];
}

const ActivitiesModal: React.FC<ActivitiesModalProps> = (props) => {
  const athlete = props.athlete;
  const activities = props.activities;
  const [modal, setModal] = useState<boolean>(false);

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
            {`${athlete.first_name} ${athlete.last_name}`}{" "}
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBodyWide}>
          {activities.length > 0 ? (
            <>
              <ChartsAndGraphs runs={activities} />
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
                  {activities.map((activity, index) => {
                    return (
                      <tr className={classes.tr} key={index}>
                        <th scope="row">{index + 1}</th>
                        <td className={classes.td}>
                          {new Date(++activity.date).toDateString()}
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
                      {new Date(+activities[0].date)
                        .toDateString()
                        .substr(4, 6)}{" "}
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
                    <td className={classes.td}>
                      {Math.floor(elevationAdder(activities).total)
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
                      {new Date(+activities[0].date)
                        .toDateString()
                        .substr(4, 6)}{" "}
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
                    <td className={classes.td}>
                      {Math.floor(elevationAdder(activities).average)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td className={classes.td}>
                      {Math.floor(avgHRAdder(activities))}
                    </td>
                    <td className={classes.td}>
                      {Math.floor(maxHRAdder(activities))}
                    </td>
                    <td className={classes.td}>N/A</td>
                  </tr>
                </tfoot>
              </Table>
            </>
          ) : (
            <></>
          )}
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
