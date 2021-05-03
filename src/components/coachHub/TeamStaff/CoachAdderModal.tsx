import React, { useState } from "react";
import APIURL from "../../../utilities/environment";
import classes from "../Coach.module.css";
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

const CoachAdderModal = (props) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState();
  const [role, setRole] = useState();

  const toggle = () => setModal(!modal);

  /*************************
  ADD COACH TO TEAM
  *************************/
  const addCoach = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/manager/addCoach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        teamId: props.selectedTeam.id,
        teammateEmail: email,
        role,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 401) {
            throw new Error("Must be a manager to perform this function");
          } else if (res.status === 403) {
            throw new Error("Can't find user with that email");
          } else if (res.status === 409) {
            throw new Error("That user is already on the team");
          } else {
            throw new Error("Something went wrong");
          }
        }
      })
      .then(async (data) => {
        await setResponse(data.message);
        setLoading(false);
        props.fetchStaff(props.selectedTeam.id);
        setTimeout(() => {
          toggle();
          setResponse("");
        }, 1200);
      })
      .catch(async (err) => {
        await setErr(err.message);
        setLoading(false);
        setTimeout(() => {
          setErr("");
        }, 4000);
      });
  };

  return (
    <div>
      <Form onSubmit={(e) => e.preventDefault()}>
        <button onClick={toggle} className={classes.adderModalButton}>
          +
        </button>
      </Form>
      <Modal className={classes.modal} isOpen={modal} toggle={toggle}>
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>
            Add Coach to {props.selectedTeam.teamName}
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => addCoach(e)}>
            <FormGroup>
              <legend>New Coach's Email</legend>
              <Label htmlFor="email">
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="newCoach@email.here"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup tag="fieldset">
              <legend>New Coaches Role</legend>
              <FormGroup check>
                <Label check>
                  <Input
                    required
                    type="radio"
                    name="radio1"
                    value="coach"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Coach
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    required
                    type="radio"
                    name="radio1"
                    value="manager"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Manager
                </Label>
              </FormGroup>
            </FormGroup>
            <Button
              className={`${classes.modalBtn} ${classes.addBtn}`}
              type="submit"
            >
              Add
            </Button>
            {loading ? <Spinner color="primary" /> : <></>}
            {response ? (
              <Alert className={classes.responseAlert}>{response}</Alert>
            ) : (
              <></>
            )}
            {err ? <Alert className={classes.errAlert}>{err}</Alert> : <></>}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
            onClick={toggle}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CoachAdderModal;
