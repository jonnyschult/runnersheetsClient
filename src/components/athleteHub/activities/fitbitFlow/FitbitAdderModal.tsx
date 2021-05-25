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

interface FitbitAdderProps {
  userInfo: UserInfo;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const FitbitAdderModal: React.FC<FitbitAdderProps> = (props) => {
  const token = props.userInfo.token;
  const [runs, setRuns] = useState<any[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [startDate, setStartDate] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [response, setResponse] = useState<string>("");
  const [alreadyAdded, setAlreadyAdded] = useState<number[]>([]);

  const toggle = () => {
    setModal(!modal);
    setRuns([]);
  };

  const runAdder = async (runObj: any) => {
    try {
      const info: Activity = {
        user_id: props.userInfo.user.id!,
        date: new Date(runObj.startTime).getTime(),
        distance_meters: runObj.distance * 1000,
        duration_seconds: runObj.activeDuration / 1000,
        elevation_meters: runObj.elevationGain,
        avg_hr: runObj.averageHeartRate,
        max_hr: undefined,
        description: undefined,
        strava_id: undefined,
        garmin_id: undefined,
        fitbit_id: runObj.logId,
      };
      const results = await poster(token, "activities/createActivity", info);
      setAlreadyAdded([...alreadyAdded, +results.data.newActivity.fitbit_id]);
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
        `fitbit_id=${runObj.logId}`
      );
      setAlreadyAdded(alreadyAdded.filter((act) => act !== runObj.logId));
      props.setActivities(
        props.activities.filter(
          (activity) => +activity.fitbit_id! !== runObj.logId
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

  const fitbitActivitiesFetcher = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${startDate}&sort=desc&offset=0&limit=100`,
        {
          //get's fitbit data
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      const runs = await data.activities.filter(
        (activity: any) =>
          (activity.activityName === "Treadmill" ||
            activity.activityName === "Run") &&
          activity.distance > 0.05
      );
      setRuns(runs);
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
      const fitbitSecretResults = await getter(token, "fitbit/getSecretId");
      const fitbitAccessFetch = await fetch(
        `https://api.fitbit.com/oauth2/token?&grant_type=refresh_token&refresh_token=${props.userInfo.user.fitbit_refresh}`, //refreshes the refresh token and gives access token.
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${fitbitSecretResults.data.authorization}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const data = await fitbitAccessFetch.json();
      setAccessToken(data.access_token);
      const updateResults = await updater(token, "users/updateUser", {
        fitbit_refresh: data.refresh_token,
      });
      const updatedUserInfo = props.userInfo;
      updatedUserInfo.user = updateResults.data.updatedUser;
      props.userInfo.setUserInfo!(updatedUserInfo);
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
    const savedFitbitActivitiesFetcher = async () => {
      try {
        const fitbitRuns: Activity[] = props.activities.filter(
          (run: Activity) => run.fitbit_id
        );
        setAlreadyAdded(fitbitRuns.map((run) => +run.fitbit_id!));
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
    savedFitbitActivitiesFetcher();
    if (props.userInfo.user.fitbit_refresh && modal) {
      getAccessToken();
    }
  }, [
    token,
    props.userInfo.user.fitbit_refresh,
    getAccessToken,
    props.activities,
    modal,
  ]);

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button className={classes.launchModalBtn} onClick={toggle}>
          Add Fitbit Activities
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName={classes.sheetModal}
        className={`print ${classes.modal}`}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>Fitbit Activities</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form
            className={classes.form}
            onSubmit={(e) => fitbitActivitiesFetcher(e)}
          >
            <FormGroup>
              <Label htmlFor="start date">From</Label>
              <Input
                required
                type="date"
                name="start date"
                onChange={(e) => setStartDate(e.target.value)}
              ></Input>
              <p>to {new Date().toDateString()}</p>
            </FormGroup>
            <Button
              className={`${classes.modalBtn} ${classes.fitbitBtn}`}
              type="submit"
            >
              Get Fitbit Activities
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
                      <th className={classes.th}>Time</th>
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
                            {run.startTime
                              ? new Date(run.startTime).toDateString()
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.distance ? run.distance.toFixed(2) : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.activeDuration
                              ? new Date(run.activeDuration)
                                  .toISOString()
                                  .substr(11, 8)
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.pace
                              ? new Date(run.pace * 1000)
                                  .toISOString()
                                  .substr(11, 8)
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.elevationGain
                              ? run.elevationGain.toFixed(2)
                              : "N/A"}
                          </td>
                          <td className={classes.td}>
                            {run.averageHeartRate
                              ? run.averageHeartRate
                              : "N/A"}
                          </td>
                          {alreadyAdded.includes(run.logId) ? (
                            <div style={{ display: "flex" }}>
                              <h5 style={{ color: "green" }}>Added &#10003;</h5>
                              <div
                                className={classes.fitbitRemoverBtn}
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

export default FitbitAdderModal;
