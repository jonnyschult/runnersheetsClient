import React, { useState } from "react";
import classes from "../Club.module.css";
import APIURL from "../../../utilities/environment";
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
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState();

  const toggle = () => setModal(!modal);

  /****************************
   ADD ATHLETE TO CLUB
   ***************************/
  const addAthlete = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/viceChair/addAthlete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        clubId: props.selectedClub.id,
        clubAthleteEmail: email,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 403) {
            throw new Error("Can't find user with that email");
          } else if (res.status === 409) {
            throw new Error("That user is already in the club");
          } else {
            throw new Error("Something went wrong");
          }
        }
      })
      .then(async (data) => {
        await props.setUpdate(data);
        await setResponse(data.message);
        setLoading(false);
        // props.fetchAthletes(props.selectedClub.id);
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
        }, 2500);
      });
  };

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} className={classes.adderModalButton}>
          +
        </Button>
      </Form>
      <Modal className={classes.modal} isOpen={modal} toggle={toggle}>
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>
            {" "}
            Add Athlete to {props.selectedClub.clubName}{" "}
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => addAthlete(e)}>
            <FormGroup>
              <legend>Athlete's Email</legend>
              <Label htmlFor="email">
                <Input
                  className={classes.plusAthleteEmail}
                  required
                  type="email"
                  name="email"
                  placeholder="newAthlete@email.here"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>
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
        <ModalFooter className={classes.modalFooter}>
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

export default AthleteAdderModal;
