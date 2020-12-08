import React, { useState, useEffect, useReducer } from "react";
import APIURL from "../../../helpers/environment";
import classes from "../Athlete.module.css";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";

const FitbitAdderModal = (props) => {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const [modal, setModal] = useState(false);
  const [description, setDescription] = useState();
  const [maxHR, setMaxHR] = useState();
  const [avgHR, setAvgHR] = useState();

  const toggle = () => setModal(!modal);

  /***************************
  UPDATE ACTIVITY 
  ***************************/
  const updateInfo = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/activity/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        activityId: props.run.id,
        description,
        avgHR,
        maxHR,
      }),
    })
      .then((res) => res.json())
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
      });
  };

  /***************************
  REMOVE ACTIVITY FROM DATABASE
  ***************************/
  const runRemover = async (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are your sure you want to delete this activity?"
    );
    if (confirm) {
      setLoading(true);
      fetch(`${APIURL}/activity/removeActivity`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify({
          activityId: props.run.id,
        }),
      })
        .then((res) => res.json())
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
        });
    } else {
      setResponse("Deletion disconfirmed");
      setTimeout(() => {
        toggle();
        setResponse("");
      }, 1200);
    }
  };

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault}>
        <h6 className={classes.editWorkoutBtn} onClick={toggle}>
          &#9998;
        </h6>
      </Form>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader className={classes.modalHeader}>
          <header className={classes.headerText}>Update Workout</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => updateInfo(e)}>
            <FormGroup>
              <Label htmlFor="description">description</Label>
              <Input
                type="textarea"
                name="description"
                placeholder={props.run.description}
                onChange={(e) => setDescription(e.target.value)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="maxHR">Max HR</Label>
              <Input
                type="number"
                name="maxHR"
                placeholder={props.run.maxHR}
                onChange={(e) => setMaxHR(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="avgHR">Avg HR</Label>
              <Input
                type="number"
                name="avgHR"
                placeholder={props.run.avgHR}
                onChange={(e) => setAvgHR(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <div className={classes.btnGroup}>
              <Button
                className={`${classes.modalBtn} ${classes.addBtn}`}
                type="submit"
              >
                Update
              </Button>
              <Button
                className={`${classes.modalBtn} ${classes.deleteBtn}`}
                onClick={(e) => runRemover(e)}
              >
                Delete
              </Button>
            </div>
            {response ? (
              <Alert className={classes.responseAlert}>{response}</Alert>
            ) : (
              <></>
            )}
            {err ? <Alert className={classes.errAlert}>{err}</Alert> : <></>}
            {loading ? <Spinner></Spinner> : <></>}
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
    </>
  );
};

export default FitbitAdderModal;
