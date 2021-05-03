import React, { useState } from "react";
import APIURL from "../../../utilities/environment";
import classes from "../Club.module.css";
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

const ChairAdderModal = (props) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState();
  const [role, setRole] = useState();

  const toggle = () => setModal(!modal);

  /*************************
  ADD CHAIR TO TEAM
  *************************/
  const addChair = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/club/addChairperson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        clubId: props.selectedClub.id,
        memberEmail: email,
        role,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 401) {
            throw new Error("Must be a chairperson to perform this function");
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
        props.fetchChairpersons(props.selectedClub.id);
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
            Add Chairperson to {props.selectedClub.clubName}
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => addChair(e)}>
            <FormGroup>
              <legend>New Chairperson's Email</legend>
              <Label htmlFor="email">
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="newChair@email.here"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup tag="fieldset">
              <legend>New Chairpersons Role</legend>
              <FormGroup check>
                <Label check>
                  <Input
                    required
                    type="radio"
                    name="radio1"
                    value="vice chairperson"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Vice Chair
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    required
                    type="radio"
                    name="radio1"
                    value="chairperson"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Chairperson
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

export default ChairAdderModal;
