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

const StaffModal = (props) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState();
  const [err, setErr] = useState("");
  const [modal, setModal] = useState(false);
  const [expand, setExpand] = useState(false);
  const [update, setUpdate] = useState()

  const toggle = () => setModal(!modal);
  const toggle2 = () => setExpand(!expand);

  /**********************
  DELETE ATHLETE
  **********************/
  const deleteAthlete = (e) => {
    let confirmation = window.confirm(
      "Are you certain you wish to delete this athlete?"
    );
    if (confirmation) {
      setLoading(true);
      fetch(`${APIURL}/viceChair/removeAthlete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify({
          clubId: props.selectedClub.id,
          athleteId: props.athlete.id,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          await setResponse(data.message);
          setLoading(false);
          setTimeout(() => {
            props.setUpdate(data);
            toggle();
            toggle2();
            setResponse("");
          }, 1400);
        })
        .catch(async (err) => {
          await setErr(err.message);
          setLoading(false);
          setTimeout(() => {
            setErr("");
          }, 2400);
        });
    } else {
      toggle();
      toggle2();
    }
  };

  return (
    <div>
      <Form>
        <p className={classes.cardItem} onClick={toggle}>
          <b>{`${props.athlete.firstName} ${props.athlete.lastName}`}</b>
        </p>
      </Form>
      <Modal
        className={classes.modal}
        isOpen={modal}
        toggle={(e) => {
          toggle();
          if (expand) {
            toggle2();
          }
        }}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header
            className={classes.headerText}
          >{`${props.athlete.firstName} ${props.athlete.lastName}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <p>{`Email:   ${props.athlete.email}`}</p>
          <Button
            className={`${classes.modalBtn} ${classes.deleteBtn}`}
            onClick={(e) => deleteAthlete(e)}
          >
            Delete
          </Button>
          {loading ? <Spinner color="primary" /> : <></>}
          {response ? (
            <Alert className={classes.responseAlert}>{response}</Alert>
          ) : (
            <></>
          )}
          {err ? <Alert className={classes.errAlert}>{err}</Alert> : <></>}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
            color="primary"
            onClick={(e) => {
              toggle();
              if (expand) {
                toggle2();
              }
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default StaffModal;
