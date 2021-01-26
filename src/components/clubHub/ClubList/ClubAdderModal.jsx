import React, { useState } from "react";
import classes from "../Club.module.css";
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

const ClubAdderModal = (props) => {
  const [modal, setModal] = useState(false);
  const [clubTitle, setClubTitle] = useState();
  const [modalContent, setModalContent] = useState(false);
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();

  const toggle = () => setModal(!modal);

  /************************
  CREATE CLUB
  ************************/
  const createClub = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/club/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        clubName: clubTitle,
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
        console.log(data);
        await props.setSelectedClub(data.result.newClub);
        await setLoading(false);
        await props.setUpdate(data);
        setTimeout(() => {
          setResponse(data.message);
          toggle();
        }, 1400);
      })
      .catch(async (err) => {
        setLoading(false);
        setErr(err.message);
        setTimeout(() => {
          setErr("");
        }, 4000);
      });
  };

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} className={classes.adderModalButton}>
          +
        </Button>
      </Form>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} className={classes.modalHeader}>
          <header className={classes.headerText}>Create a Club!</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form onSubmit={(e) => createClub(e)}>
            <Label htmlFor="club name">Choose a Club Name</Label>
            <Input
              required
              type="text"
              name="club name"
              placeholder="Chicago Ultra Runners"
              onChange={(e) => setClubTitle(e.target.value)}
            ></Input>
            <Button
              className={`${classes.modalBtn} ${classes.addBtn}`}
              type="submit"
            >
              Create
            </Button>
            {loading ? <Spinner color="primary" /> : <></>}
            {response ? (
              <Alert className={classes.responseAlert}>{response}</Alert>
            ) : (
              <></>
            )}
            {err ? <Alert className={classes.errAlert}>{err}</Alert> : <></>}
            <h6
              className={classes.modalSwitch}
              onClick={(e) => setModalContent(!modalContent)}
            >
              Update
            </h6>
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

export default ClubAdderModal;
