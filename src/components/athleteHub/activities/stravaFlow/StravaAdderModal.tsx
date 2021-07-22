import React, { useState, useEffect, useCallback } from "react";
import classes from "../../Athlete.module.css";
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
import { Activity, UserInfo } from "../../../../models";
import { deleter, getter, poster, updater } from "../../../../utilities";
import axios from "axios";

interface StravaAdderProps {
  userInfo: UserInfo;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const StravaAdderModal: React.FC<StravaAdderProps> = (props) => {
  const token = props.userInfo.token;
  const [runs, setRuns] = useState<any[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [startDate, setStartDate] = useState<number>();
  const [endDate, setEndDate] = useState<number>();
  const [loading, setLoading] = useState<boolean>();
  const [response, setResponse] = useState<string>("");
  const [alreadyAdded, setAlreadyAdded] = useState<number[]>([]);

  const toggle = () => {
    setModal(!modal);
    setRuns([]);
  };

  const secondsToTime = (e: number) => {
    var h = Math.floor(e / 3600)
        .toString()
        .padStart(2, "0"),
      m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, "0"),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  const runAdder = async (runObj: any) => {
    try {
      const info: Activity = {
        user_id: props.userInfo.user.id!,
        date: new Date(runObj.start_date_local).getTime(),
        distance_meters: runObj.distance,
        duration_seconds: runObj.moving_time,
        elevation_meters: runObj.total_elevation_gain
          ? runObj.total_elevation_gain
          : undefined,
        avg_hr: runObj.average_heartrate
          ? runObj.average_heartrate.toFixed(0)
          : undefined,
        max_hr: runObj.max_heartrate
          ? runObj.max_heartrate.toFixed(0)
          : undefined,
        description: undefined,
        strava_id: runObj.id,
        garmin_id: undefined,
        fitbit_id: undefined,
      };
      const results = await poster(token, "activities/createActivity", info);
      setAlreadyAdded([...alreadyAdded, +results.data.newActivity.strava_id]);
      const sortedActivities = [
        ...props.activities,
        results.data.newActivity,
      ].sort((a: Activity, b: Activity) => {
        if (new Date(+a.date).getTime() > new Date(+b.date).getTime()) {
          return -1;
        } else {
          return 1;
        }
      });
      props.setActivities(sortedActivities);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("");
      }
      setTimeout(() => {
        setResponse("");
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  const runRemover = async (runObj: any) => {
    try {
      await deleter(
        token,
        "activities/removeActivity",
        `strava_id=${runObj.id}`
      );
      setAlreadyAdded(alreadyAdded.filter((act) => act !== runObj.id));
      props.setActivities(
        props.activities.filter(
          (activity) => +activity.strava_id! !== runObj.id
        )
      );
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("");
      }
      setTimeout(() => {
        setResponse("");
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  const activitiesFetcher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const results = await axios(
        `https://www.strava.com/api/v3/athlete/activities?before=${endDate}&after=${startDate}&per_page=200&access_token=${accessToken}`
      );
      const runsData = await results.data.filter(
        (activity: any) =>
          (activity.type === "Treadmill" ||
            activity.type === "Run" ||
            activity.type === "Walk" ||
            activity.type === "Hike") &&
          activity.distance > 0.05
      );
      setRuns(runsData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("");
      }
      setTimeout(() => {
        setResponse("");
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = useCallback(async () => {
    try {
      const results = await getter(token, "strava/getAccessToken");
      setAccessToken(results.data.accessToken);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("");
      }
      setTimeout(() => {
        setResponse("");
      }, 2200);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const savedActivitiesFetcher = async () => {
      try {
        const stravaRuns: Activity[] = props.activities.filter(
          (run: Activity) => run.strava_id
        );
        setAlreadyAdded(stravaRuns.map((run) => +run.strava_id!));
      } catch (error) {
        console.log(error);
        if (error.response !== undefined && error.response.status < 500) {
          setResponse(error.response.data.message);
        } else {
          setResponse("");
        }
        setTimeout(() => {
          setResponse("");
        }, 2200);
      }
    };
    savedActivitiesFetcher();
    if (props.userInfo.user.strava_refresh && modal) {
      getAccessToken();
    }
  }, [
    token,
    props.userInfo.user.strava_refresh,
    getAccessToken,
    props.activities,
    modal,
  ]);

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button className={classes.launchModalBtn} onClick={toggle}>
          Add Strava Activities
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName={classes.sheetModal}
        className={`print ${classes.modal}`}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>Strava Activities</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => activitiesFetcher(e)}>
            <FormGroup>
              <Label htmlFor="start date">From</Label>
              <Input
                required
                type="date"
                name="start date"
                onChange={(e) =>
                  setStartDate(new Date(e.target.value).getTime() / 1000)
                }
              ></Input>
              <p>to {new Date().toDateString()}</p>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="end date">To</Label>
              <Input
                required
                type="date"
                name="end date"
                onChange={(e) => {
                  setEndDate(new Date(e.target.value).getTime() / 1000);
                }}
              ></Input>
              <p>to {new Date().toDateString()}</p>
            </FormGroup>
            <Button
              className={`${classes.modalBtn} ${classes.activitiesBtn}`}
              type="submit"
            >
              Get Strava Activities
            </Button>
          </Form>
          {runs ? (
            <Table>
              {loading ? (
                <Spinner></Spinner>
              ) : (
                <>
                  {" "}
                  <h5>Runs</h5>
                  <thead className={classes.thead}>
                    <tr className={classes.tr}>
                      <th className={classes.th}>#</th>
                      <th className={classes.th}>Date</th>
                      <th className={classes.th}>Kilometers</th>
                      <th className={classes.th}>Duration</th>
                      <th className={classes.th}>Pace km</th>
                      <th className={classes.th}>Elevation/m</th>
                      <th className={classes.th}>Average HR</th>
                      <th className={classes.th}>Upload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run: any, index: number) => {
                      return (
                        <tr className={classes.tr} key={index}>
                          <th scope="row">{index + 1}</th>
                          <td className={classes.td}>
                            {run.start_date_local
                              ? new Date(run.start_date_local).toDateString()
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.distance
                              ? (run.distance.toFixed(2) / 1000).toFixed(2)
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.moving_time
                              ? secondsToTime(run.moving_time)
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.moving_time && run.distance
                              ? secondsToTime(
                                  run.moving_time / (run.distance / 1000)
                                )
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.total_elevation_gain
                              ? run.total_elevation_gain.toFixed(2)
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.average_heartrate
                              ? run.average_heartrate
                              : "N/A"}
                          </td>
                          {alreadyAdded.includes(run.id) ? (
                            <div style={{ display: "flex" }}>
                              <h5 style={{ color: "green" }}>Added &#10003;</h5>
                              <div
                                className={classes.activitiesRemoverBtn}
                                onClick={(e) => runRemover(run)}
                              >
                                Undo
                              </div>
                            </div>
                          ) : (
                            <Button onClick={(e) => runAdder(run)}>
                              Add Run
                            </Button>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              )}
            </Table>
          ) : (
            <></>
          )}
          {response ? <Alert>{response}</Alert> : <></>}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={toggle}
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
          >
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default StravaAdderModal;
