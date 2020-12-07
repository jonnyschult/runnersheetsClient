import React, { useState } from "react";
import APIURL from "../../../helpers/environment";
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

const StaffModal = (props) => {
  const [response, setResponse] = useState("");
  const [err, setErr] = useState();
  const [loading, setLoading] = useState();
  const [modal, setModal] = useState(false);
  const [expand, setExpand] = useState(false);
  const [role, setRole] = useState();

  const toggle = () => setModal(!modal);
  const toggle2 = () => setExpand(!expand);

  /**********************
  UPDATE COACH ROLE
  **********************/
  const updateInfo = (e) => {
    e.preventDefault();
    console.log(role);
    fetch(`${APIURL}/manager/updateCoach`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        teamId: props.selectedTeam.id,
        userId: props.coach.id,
        newRole: role,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        setLoading(true);
        await setResponse(data.message);
        setLoading(false);
        props.fetchStaff(props.selectedTeam.id);
        setTimeout(() => {
          toggle();
          toggle2();
          setResponse("");
        }, 1200);
      })
      .catch(async (err) => {
        setLoading(true);
        await setErr(err.message);
        setLoading(false);
      });
  };

  /**********************
  DELETE COACH
  **********************/
  const deleteCoach = (e) => {
    let confirmation = window.confirm(
      "Are you certain you wish to delete this user?"
    );
    if (confirmation) {
      fetch(`${APIURL}/manager/removeCoach`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify({
          teamId: props.selectedTeam.id,
          coachId: props.coach.id,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          setLoading(true);
          await setResponse(data.message);
          setLoading(false);
          setTimeout(() => {
            toggle();
            toggle2();
            setResponse("");
            props.fetchStaff(props.selectedTeam.id);
          }, 1200);
        })
        .catch(async (err) => {
          setLoading(true);
          await setErr(err.message);
          setLoading(false);
        });
    } else {
      toggle();
      toggle2();
    }
  };

  return (
    <div>
      <Form inline onSubmit={(e) => updateInfo(e)}>
        <p onClick={toggle} className={classes.cardItem}>
          <b>{`${props.coach.firstName} ${props.coach.lastName}: `}</b>
          <i> {props.coach.role}</i>
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
          >{`${props.coach.firstName} ${props.coach.lastName}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <p>{`Email:   ${props.coach.email}`}</p>
          <p>{`Role:   ${props.coach.role}`}</p>
          <h6 className={classes.modalExpand} onClick={toggle2}>
            Update
          </h6>
          {expand ? (
            <Form className={classes.form} onSubmit={(e) => updateInfo(e)}>
              <FormGroup tag="fieldset">
                <legend>New Coaches Role</legend>
                <FormGroup check>
                  <Label check>
                    <Input
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
                      type="radio"
                      name="radio1"
                      value="manager"
                      onChange={(e) => setRole(e.target.value)}
                    />
                    Manager
                  </Label>
                </FormGroup>
              </FormGroup>
              <div className={classes.btnGroup}>
                <Button
                  className={`${classes.modalBtn} ${classes.updateBtn}`}
                  type="submit"
                >
                  Update
                </Button>
                <Button
                  className={`${classes.modalBtn} ${classes.deleteBtn}`}
                  onClick={(e) => deleteCoach(e)}
                >
                  Delete
                </Button>
              </div>
              {loading ? <Spinner color="primary" /> : <></>}
              {response ? (
                <Alert className={classes.responseAlert}>{response}</Alert>
              ) : (
                <></>
              )}
              {err ? (
                <Alert className={classes.responseAlert}>{err}</Alert>
              ) : (
                <></>
              )}
            </Form>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
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
