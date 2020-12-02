import React, { useState } from "react";
import APIURL from "../../../helpers/environment";
import "./Activities.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Label,
  Input,
  Form,
  Alert,
  Spinner,
  Table,
} from "reactstrap";

const ActivitiesModal = (props) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} style={{ margin: "0 auto" }}>
          Generate
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName="sheetModal"
        className="print"
      >
        <ModalHeader toggle={toggle}>Collated Workouts</ModalHeader>
        <ModalBody>
          {props.teamActivities ? (
            props.teamActivities.map((athlete, index) => {
              return (
                <Table key={index}>
                  <h5>{`${athlete.firstName} ${athlete.lastName}`}</h5>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Meters</th>
                      <th>Time</th>
                      <th>Pace km</th>
                      <th>Elevation/m</th>
                      <th>Average HR</th>
                      <th>Max HR</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {athlete.activities.map((activity, index) => {
                      return (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>
                            {new Date(parseInt(activity.date)).toDateString()}
                          </td>
                          <td>
                            {activity.meters
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td>
                            {new Date(activity.durationSecs * 1000)
                              .toISOString()
                              .substr(11, 8)}
                          </td>
                          <td>
                            {new Date(
                              (activity.durationSecs /
                                (activity.meters / 1000)) *
                                1000
                            )
                              .toISOString()
                              .substr(11, 8)}
                          </td>
                          <td>{activity.elevationMeters}</td>
                          <td>{activity.avgHR}</td>
                          <td>{activity.maxHR}</td>
                          <td>{activity.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              );
            })
          ) : (
            <div>Choose a team!</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle} className="modalButton">
            Cancel
          </Button>
          <Button onClick={(e) => window.print()} className="modalButton">
            Print
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ActivitiesModal;
