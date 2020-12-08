import React, { useState } from "react";
import APIURL from "../../../helpers/environment";
import classes from "../Athlete.module.css";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";

const ManualActivityAdder = (props) => {
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [distance, setDistance] = useState();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [maxHR, setMaxHR] = useState();
  const [avgHR, setAvgHR] = useState();
  const [elevation, setElevation] = useState();
  const [description, setDescription] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState();
  const [err, setErr] = useState();

  const toggle = () => setModal(!modal);

  /***************************
  ADD ACTIVITY TO DATABASE
  ***************************/
  const runAdder = async (e) => {
    e.preventDefault();
    setLoading(true);
    let dateTime =
      new Date(`${date}T${time}:00.000Z`).getTime() +
      new Date(`${date}T${time}:00.000Z`).getTimezoneOffset() * 60 * 1000;
    console.log(dateTime, date, time);
    //prettier-ignore
    let duration = ((hours * 60 * 60) + (minutes * 60) + seconds)
    fetch(`${APIURL}/activity/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        date: dateTime,
        meters: distance,
        durationSecs: duration,
        elevationMeters: elevation,
        avgHR: avgHR,
        maxHR: maxHR,
        description: description,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await props.setUpdate(data);
        await setResponse(data.message);
        setMinutes(0);
        setSeconds(0);
        setHours("");
        setMaxHR("");
        setAvgHR("");
        setElevation("");
        setDescription("");
        setDistance("");
        setLoading(false);
        setTimeout(() => {
          setResponse("");
          toggle();
        }, 1200);
      })
      .catch((err) => {
        setErr(err.message);
        setLoading(false);
        setTimeout(() => {
          setErr("");
        }, 3000);
      });
  };

  return (
    <div>
      <Form onSubmit={(e) => e.preventDefault}>
        <Button className={classes.launchModalBtn} onClick={toggle}>
          Add Activity Manually
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        // contentClassName={classes.sheetModal}
        className={`${classes.modal} print`}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          Adder Modal
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form
            className={classes.manualAdderForm}
            onSubmit={(e) => runAdder(e)}
          >
            <FormGroup>
              <Label htmlFor="date">Date</Label>
              <Input
                required
                type="date"
                name="date"
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="time">time</Label>
              <Input
                required
                type="time"
                name="time"
                onChange={(e) => {
                  setTime(e.target.value);
                  console.log(time);
                }}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="distance">Distance in Meters</Label>
              <Input
                required
                type="number"
                name="distance"
                onChange={(e) => setDistance(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <div className={classes.timeGroup}>
              <FormGroup>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  required
                  type="number"
                  name="hours"
                  onChange={(e) => setHours(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="Minutes">Minutes</Label>
                <Input
                  required
                  type="number"
                  name="minutes"
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="seconds">Seconds</Label>
                <Input
                  required
                  type="number"
                  name="seconds"
                  onChange={(e) => setSeconds(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
            </div>
            <FormGroup>
              <Label htmlFor="elevation">Elevation Gain*</Label>
              <Input
                type="number"
                name="elevation"
                onChange={(e) => setElevation(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="avgHR">Average Heart Rate*</Label>
              <Input
                type="number"
                name="avgHR"
                onChange={(e) => setAvgHR(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="maxHR">Max Heart Rate*</Label>
              <Input
                type="number"
                name="maxHR"
                onChange={(e) => setMaxHR(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Description*</Label>
              <Input
                type="text"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
              ></Input>
            </FormGroup>
            <Button
              className={`${classes.modalBtn} ${classes.addBtn}`}
              type="submit"
            >
              Submit
            </Button>
            {response ? <Alert>{response}</Alert> : <></>}
            {err ? <Alert color="danger">{err}</Alert> : <></>}
            {loading ? <Spinner></Spinner> : <></>}
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

export default ManualActivityAdder;
