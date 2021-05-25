import React, { useState } from "react";
import classes from "../Athlete.module.css";
import {
  Button,
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
import { Activity, UserInfo } from "../../../models";
import { deleter, updater } from "../../../utilities";

interface UpdateModalProps {
  userInfo: UserInfo;
  activity: Activity;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const UpdateModal: React.FC<UpdateModalProps> = (props) => {
  const activity = props.activity;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [date, setDate] = useState<string>(
    new Date(activity.date / 1000).toISOString().substr(0, 10)
  );
  const [time, setTime] = useState<string>(
    new Date(activity.date / 1000).toISOString().substr(11, 5)
  );
  const [distance, setDistance] = useState<number>(activity.distance_meters);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [maxHR, setMaxHR] = useState<number | undefined>(activity.max_hr);
  const [avgHR, setAvgHR] = useState<number | undefined>(activity.avg_hr);
  const [elevation, setElevation] = useState<number | undefined>(
    activity.elevation_meters
  );
  const [description, setDescription] = useState<string | undefined>(
    activity.description
  );

  const toggle = () => setModal(!modal);
  /***************************
  UPDATE ACTIVITY 
  ***************************/
  const updateInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      let dateTime =
        new Date(`${date}T${time}:00.000Z`).getTime() +
        new Date(`${date}T${time}:00.000Z`).getTimezoneOffset() * 60 * 1000;
      let duration;
      if (hours || minutes || seconds) {
        duration = hours * 60 * 60 + minutes * 60 + seconds;
      } else {
        duration = activity.duration_seconds;
      }

      const info: Activity = {
        id: activity.id,
        user_id: activity.user_id,
        date: dateTime,
        distance_meters: distance,
        duration_seconds: duration,
        elevation_meters: elevation,
        avg_hr: avgHR,
        max_hr: maxHR,
        description: description,
      };
      const results = await updater(
        props.userInfo.token,
        "activities/updateActivity",
        info
      );
      const updatedActivity: Activity = results.data.updatedActivity;
      props.setActivities(
        props.activities.map((activityItem) => {
          if (activityItem.id === updatedActivity.id) {
            return updatedActivity;
          } else {
            return activityItem;
          }
        })
      );
      setResponse("Update Successful");
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
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

  /***************************
  REMOVE ACTIVITY FROM DATABASE
  ***************************/
  const runRemover = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are your sure you want to delete this activity?"
    );
    if (confirm) {
      try {
        setLoading(true);
        await deleter(
          props.userInfo.token,
          "activities/removeActivity",
          `id=${activity.id}`
        );

        props.setActivities(
          props.activities.filter(
            (activityItem) => activityItem.id !== activity.id
          )
        );
        setResponse("Delete successful");
        setTimeout(() => {
          setResponse("");
          toggle();
        }, 1500);
      } catch (error) {
        console.log(error);
        if (error.response !== undefined && error.response.status < 500) {
          setResponse(error.response.data.message);
        } else {
          setResponse("Could not delete activity. Server error");
        }
        setTimeout(() => {
          setResponse("");
          toggle();
        }, 2200);
      } finally {
        setLoading(false);
      }
    } else {
      setResponse("Deletion cancelled");
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
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                name="date"
                disabled={activity.fitbit_id ? true : false}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="time">Time of Day</Label>
              <Input
                type="time"
                name="time"
                disabled={activity.fitbit_id ? true : false}
                onChange={(e) => {
                  setTime(e.target.value);
                }}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="distance">Distance in Meters</Label>
              <Input
                type="number"
                name="distance"
                disabled={activity.fitbit_id ? true : false}
                placeholder={`${activity.distance_meters}`}
                onChange={(e) => setDistance(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <div className={classes.timeGroup}>
              <FormGroup>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  type="number"
                  name="hours"
                  disabled={activity.fitbit_id ? true : false}
                  placeholder={new Date(activity.duration_seconds * 1000)
                    .toISOString()
                    .substr(11, 2)}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="Minutes">Minutes</Label>
                <Input
                  type="number"
                  name="minutes"
                  disabled={activity.fitbit_id ? true : false}
                  placeholder={new Date(activity.duration_seconds * 1000)
                    .toISOString()
                    .substr(14, 2)}
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="seconds">Seconds</Label>
                <Input
                  type="number"
                  name="seconds"
                  disabled={activity.fitbit_id ? true : false}
                  placeholder={new Date(activity.duration_seconds * 1000)
                    .toISOString()
                    .substr(17, 2)}
                  onChange={(e) => setSeconds(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
            </div>
            <FormGroup>
              <Label htmlFor="elevation">Elevation Gain in Meters*</Label>
              <Input
                type="number"
                name="elevation"
                disabled={activity.fitbit_id ? true : false}
                placeholder={`${activity.elevation_meters}`}
                onChange={(e) => setElevation(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">description</Label>
              <Input
                type="textarea"
                name="description"
                placeholder={activity.description}
                onChange={(e) => setDescription(e.target.value)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="maxHR">Max HR</Label>
              <Input
                type="number"
                name="maxHR"
                placeholder={`${activity.max_hr}`}
                onChange={(e) => setMaxHR(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="avgHR">Avg HR</Label>
              <Input
                type="number"
                name="avgHR"
                placeholder={`${activity.avg_hr}`}
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

            {loading ? <Spinner></Spinner> : <></>}
          </Form>
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
            onClick={toggle}
          >
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UpdateModal;
