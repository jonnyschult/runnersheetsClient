import React, { useState } from "react";
import APIURL from "../../helpers/environment";
import classes from "./Athlete.module.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Spinner,
} from "reactstrap";

const AthleteUpdater = (props) => {
  const [err, setErr] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const removeSelf = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/club/removeSelf`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        clubId: props.club.id,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 405) {
          throw new Error(
            "Removal failed. Must have atleast one chairperson on a club. Go to clubs to delete clubs page."
          );
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(async (data) => {
        await setResponse(data.message);
        setLoading(false);
        setTimeout(() => {
          props.setUpdate(data);
          toggle();
          setResponse("");
        }, 1200);
      })
      .catch((err) => {
        setErr(err.message);
        setLoading(false);
        setTimeout(() => {
          toggle();
          setResponse("");
        }, 2500);
      });
  };

  return (
    <>
      <p className={classes.removeClub} onClick={toggle}>
        -
      </p>
      <Modal isOpen={modal} toggle={toggle} className={classes.removeClubModal}>
        <ModalHeader className={classes.modalHeader}>
          <header className={classes.headerText}>Remove Club</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <h5>{`Are you sure you want to remove yourself from ${props.club.clubName}?`}</h5>
          <Button
            className={`${classes.modalBtn} ${classes.deleteBtn}`}
            onClick={(e) => removeSelf(e)}
          >
            Remove
          </Button>
          {response ? (
            <Alert className={classes.responseAlert}>{response}</Alert>
          ) : (
            <></>
          )}
          {err ? <Alert className={classes.errAlert}>{err}</Alert> : <></>}
          {loading ? <Spinner></Spinner> : <></>}
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
    </>
  );
};

export default AthleteUpdater;
