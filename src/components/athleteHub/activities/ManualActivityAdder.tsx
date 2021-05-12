import React, { useState } from "react";
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
import { Activity, UserInfo } from "../../../models";
import { poster } from "../../../utilities";

interface ManualActivityProps {
  userInfo: UserInfo;
  activities: Activity[];
  endDate: number;
  startDate: number;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const ManualActivityAdder: React.FC<ManualActivityProps> = (props) => {
  const [modal, setModal] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [distance, setDistance] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [maxHR, setMaxHR] = useState<number | undefined>();
  const [avgHR, setAvgHR] = useState<number | undefined>();
  const [elevation, setElevation] = useState<number | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const toggle = () => setModal(!modal);

  /***************************
  ADD ACTIVITY TO DATABASE
  ***************************/
  const runAdder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      let dateTime =
        new Date(`${date}T${time}:00.000Z`).getTime() +
        new Date(`${date}T${time}:00.000Z`).getTimezoneOffset() * 60 * 1000;
      //prettier-ignore
      let duration = ((hours * 60 * 60) + (minutes * 60) + seconds)
      const info: Activity = {
        user_id: props.userInfo.user.id!,
        date: dateTime,
        distance_meters: distance,
        duration_seconds: duration,
        elevation_meters: elevation,
        avg_hr: avgHR,
        max_hr: maxHR,
        description: description,
      };
      const results = await poster(
        props.userInfo.token,
        "activities/createActivity",
        info
      );
      const newActivity: Activity = results.data.newActivity;
      if (
        newActivity.date < props.endDate &&
        newActivity.date > props.startDate &&
        props.activities.length > 0
      ) {
        const sortedActivities: Activity[] = [
          ...props.activities,
          newActivity,
        ].sort((actA: Activity, actB: Activity) => {
          return actA.date - actB.date;
        });
        props.setActivities(sortedActivities);
      } else if (props.activities.length === 0) {
        props.setActivities([newActivity]);
      }

      setMinutes(0);
      setSeconds(0);
      setHours(0);
      setMaxHR(undefined);
      setAvgHR(undefined);
      setElevation(undefined);
      setDescription("");
      setDistance(0);
      setResponse("Update Successful");
      setTimeout(() => {
        setResponse("");
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.status < 500 && error["response"] !== undefined) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not update user. Server error");
      }
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } finally {
      setLoading(false);
    }
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
              <Label htmlFor="time">Time of Day</Label>
              <Input
                required
                type="time"
                name="time"
                onChange={(e) => {
                  setTime(e.target.value);
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
              <Label htmlFor="elevation">Elevation Gain in Meters*</Label>
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
