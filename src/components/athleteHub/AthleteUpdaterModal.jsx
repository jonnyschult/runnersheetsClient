import React, { useState } from "react";
import APIURL from "../../helpers/environment";
import classes from "./Athlete.module.css";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";

const AthleteUpdater = (props) => {
  const [feet, setFeet] = useState(
    Math.floor(props.athlete.heightInInches / 12)
  );
  const [inches, setInches] = useState(props.athlete.heightInInches % 12);
  const [weight, setWeight] = useState(props.athlete.weight);
  const [DOB, setDOB] = useState(props.athlete.DOB);
  const [err, setErr] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const updateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    let height = 0;
    if (feet && inches) {
      height = feet * 12 + inches;
    }
    fetch(`${APIURL}/user/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        heightInInches: height,
        weightInPounds: weight,
        DOB,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {
          throw new Error("No User Found");
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(async (data) => {
        await props.setUpdate(data);
        await setResponse(data.message);
        setLoading(false);
        setTimeout(() => {
          toggle();
          setResponse("");
        }, 1200);
      })
      .catch((err) => {
        setErr(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault}>
        <h6 className={classes.adderModalButton} onClick={toggle}>
          +
        </h6>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName="sheetModal"
        className={`print ${classes.modal}`}
      >
        <ModalHeader className={classes.modalHeader}>
          <header className={classes.headerText}>Update Athlete Metrics</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => updateInfo(e)}>
            <FormGroup style={{ display: "flex" }}>
              <span> Height</span>
              <Label htmlFor="feet">Feet</Label>
              <Input
                type="number"
                name="feet"
                defaultValue={Math.floor(props.athlete.heightInInches / 12)}
                onChange={(e) => setFeet(parseInt(e.target.value))}
              ></Input>
              <Label htmlFor="inches">Inches</Label>
              <Input
                type="number"
                name="inches"
                defaultValue={Math.floor(props.athlete.heightInInches % 12)}
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
              <Label htmlFor="DOB">DOB</Label>
              <Input
                type="date"
                name="DOB"
                placeholder={props.athlete.DOB}
                onChange={(e) => setDOB(e.target.value)}
              ></Input>
            </FormGroup>
            <Button
              className={`${classes.modalBtn} ${classes.addBtn}`}
              type="submit"
            >
              Submit
            </Button>
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

export default AthleteUpdater;
