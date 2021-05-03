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

const StaffModal = (props) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState();
  const [err, setErr] = useState("");
  const [modal, setModal] = useState(false);
  const [expand, setExpand] = useState(false);
  const [feet, setFeet] = useState(
    Math.floor(props.athlete.heightInInches / 12)
  );
  const [inches, setInches] = useState(props.athlete.heightInInches % 12);
  const [DOB, setDOB] = useState();
  const [weight, setWeight] = useState();

  const toggle = () => setModal(!modal);
  const toggle2 = () => setExpand(!expand);

  /**********************
  UPDATE ATHLETE
  **********************/
  const updateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/coach/updateAthlete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        owner: props.athlete.id,
        heightInInches: feet * 12 + inches,
        weightInPounds: weight,
        DOB,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await setResponse(data.message);
        props.fetchAthletes(props.selectedTeam.id);
        setLoading(false);
        setTimeout(() => {
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
  };

  /**********************
  DELETE ATHLETE
  **********************/
  const deleteAthlete = (e) => {
    let confirmation = window.confirm(
      "Are you certain you wish to delete this athlete?"
    );
    if (confirmation) {
      setLoading(true);
      fetch(`${APIURL}/coach/removeAthlete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify({
          teamId: props.selectedTeam.id,
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
      <Form inline onSubmit={(e) => updateInfo(e)}>
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
          <p>{`DOB:   ${props.athlete.DOB.substring(10, 0)}`}</p>
          {props.athlete.weightInPounds ? (
            <p>{`Weight:   ${props.athlete.weightInPounds}lbs`}</p>
          ) : (
            <></>
          )}
          {props.athlete.heightInInches ? (
            <p>{`Height:   ${Math.floor(props.athlete.heightInInches / 12)}' ${
              props.athlete.heightInInches % 12
            }"`}</p>
          ) : (
            <></>
          )}
          <h6 className={classes.modalExpand} onClick={toggle2} caret>
            Update
          </h6>
          {expand ? (
            <Form onSubmit={(e) => updateInfo(e)} className={classes.form}>
              <legend>Athlete Info</legend>
              <FormGroup style={{ display: "flex" }}>
                <span> Height</span>
                <Label htmlFor="feet">Feet</Label>
                <Input
                  type="number"
                  name="feet"
                  placeholder={Math.floor(props.athlete.heightInInches / 12)}
                  onChange={(e) => setFeet(parseInt(e.target.value))}
                ></Input>
                <Label htmlFor="feet">Inches</Label>
                <Input
                  type="number"
                  name="feet"
                  placeholder={props.athlete.heightInInches % 12}
                  onChange={(e) => setInches(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  type="number"
                  name="weight"
                  placeholder={props.athlete.weightInPounds}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="DOB">DOB*</Label>
                <Input
                  type="number"
                  name="DOB"
                  placeholder={props.athlete.DOB}
                  onChange={(e) => setDOB(e.target.value)}
                ></Input>
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
                  onClick={(e) => deleteAthlete(e)}
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
              {err ? <Alert className={classes.errAlert}>{err}</Alert> : <></>}
            </Form>
          ) : (
            <></>
          )}
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
