import React, { useState } from "react";
import APIURL from "../../../helpers/environment";
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
} from "reactstrap";

const TeamAdderModal = (props) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState();
  const [modal, setModal] = useState(false);
  const [teamTitle, setTeamTitle] = useState();

  const toggle = () => setModal(!modal);

  const createTeam = (e) => {
    e.preventDefault();
    fetch(`${APIURL}/team/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        teamName: teamTitle,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 409) {
            throw new Error("Name Already Taken");
          } else {
            throw new Error("Something went wrong");
          }
        }
      })
      .then(async (data) => {
        props.setLoading(true);
        await props.setResponse(data.message);
        props.setLoading(false);
        setTimeout(toggle, 1200);
      })
      .catch(async (err) => {
        props.setLoading(true);
        await props.setResponse(err.message);
        props.setLoading(false);
      });
  };

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} style={{ margin: "0 auto" }}>
          Create Team
        </Button>
      </Form>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Create a Team and Start Coaching!
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => createTeam(e)}>
            <Label htmlFor="team name">Choose a Team Name</Label>
            <Input
              required
              type="text"
              name="tean name"
              placeholder="e. g. Girls Varsity Cross Country"
              onChange={(e) => setTeamTitle(e.target.value)}
            ></Input>
            <Button color="primary" type="submit">
              Create
            </Button>
            {loading ? <Spinner color="primary" /> : <></>}
            {response ? (
              <Alert style={{ backgroundColor: " rgb(255, 155, 0)" }}>
                {response}
              </Alert>
            ) : (
              <></>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TeamAdderModal;
