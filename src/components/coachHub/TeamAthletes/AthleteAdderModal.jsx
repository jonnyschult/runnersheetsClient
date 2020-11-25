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
  FormGroup,
  Alert,
  Spinner,
} from "reactstrap";

const AthleteAdderModal = (props) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState();
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState();

  const toggle = () => setModal(!modal);

  const addAthlete = (e) => {
    e.preventDefault();
    fetch(`${APIURL}/coach/addAthlete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        teamId: props.selectedTeam.id,
        teammateEmail: email,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 403) {
            throw new Error("Can't find user with that email");
          } else if (res.status === 409) {
            throw new Error("That user is already on the team");
          } else {
            throw new Error("Something went wrong");
          }
        }
      })
      .then(async (data) => {
        setLoading(true);
        await setResponse(data.message);
        setLoading(false);
        props.fetchAthletes(props.selectedTeam.id);
        setTimeout(toggle, 1200);
      })
      .catch(async (err) => {
        setLoading(true);
        await setResponse(err.message);
        setLoading(false);
      });
  };

  return (
    <div>
      <Form inline onSubmit={(e) => addAthlete(e)}>
        <Button onClick={toggle} style={{ margin: "0 auto" }}>
          Add Athlete
        </Button>
      </Form>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Add Athlete to {props.selectedTeam.teamName}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => addAthlete(e)}>
            <FormGroup>
              <legend>Athlete's Email</legend>
              <Label htmlFor="email">
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="newAthlete@email.here"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>
            </FormGroup>

            <Button color="primary" type="submit">
              Add
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

export default AthleteAdderModal;
