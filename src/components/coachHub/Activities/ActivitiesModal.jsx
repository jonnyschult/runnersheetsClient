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
  //   const [response, setResponse] = useState("");
  //   const [loading, setLoading] = useState();
  const [modal, setModal] = useState(false);
  //   const [teamTitle, setTeamTitle] = useState();

  const toggle = () => setModal(!modal);

  //   const createTeam = (e) => {
  //     e.preventDefault();
  //     fetch(`${APIURL}/team/create`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: props.token,
  //       },
  //       body: JSON.stringify({
  //         teamName: teamTitle,
  //       }),
  //     })
  //       .then((res) => {
  //         if (res.ok) {
  //           return res.json();
  //         } else {
  //           if (res.status === 409) {
  //             throw new Error("Name Already Taken");
  //           } else {
  //             throw new Error("Something went wrong");
  //           }
  //         }
  //       })
  //       .then(async (data) => {
  //         props.setLoading(true);
  //         await props.setResponse(data.message);
  //         props.setLoading(false);
  //         setTimeout(toggle, 1200);
  //       })
  //       .catch(async (err) => {
  //         props.setLoading(true);
  //         await props.setResponse(err.message);
  //         props.setLoading(false);
  //       });
  //   };

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} style={{ margin: "0 auto" }}>
          More Info
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName="sheetModal"
        className="print"
      >
        <ModalHeader toggle={toggle}>
          {`${props.athlete.firstName} ${props.athlete.lastName}`}
        </ModalHeader>
        <ModalBody>
          <Table>
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
              {props.athlete.activities.map((activity, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{new Date(activity.date).toDateString()}</td>
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
                        (activity.durationSecs / (activity.meters / 1000)) *
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
