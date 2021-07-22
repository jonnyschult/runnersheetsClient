import React, { useState, useEffect, useCallback } from "react";
import classes from "../../Athlete.module.css";
import FitbitAuth from "./FitbitAuth";
import axios from "axios";
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
  startDate: number;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const FitbitAdderModal: React.FC<FitbitAdderProps> = (props) => {
  const token = props.userInfo.token;
  const [runs, setRuns] = useState<any[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(
    props.userInfo.user.fitbit_refresh ? true : false
  );
  const [accessToken, setAccessToken] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>();
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
      ].sort((a: Activity, b: Activity) => +a.date - +b.date);
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
      const results = await axios({
        url: `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${fromDate}&sort=desc&offset=0&limit=100`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const runsData = await results.data.activities.filter(
        (activity: any) =>
          (activity.activityName === "Treadmill" ||
            activity.activityName === "Run") &&
          activity.distance > 0.05
      );
      setRuns(runsData);
      setLoading(false);
      setResponse(
        results.data.activities.length > 0
          ? "Success"
          : "No runs for that period."
      );
      setTimeout(() => {
        setResponse("");
      }, 1500);
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        setResponse("Looks like you may need to reauthorize access to Strava");
        setTimeout(() => {
          setAuthorized(false);
        }, 2100);
      } else if (error.response !== undefined && error.response.status < 500) {
        setResponse(
          error.response.data.message +
            "If problem perists, you may need to reauthorize in settings."
        );
      } else {
        setResponse(
          "Error: If problem perists, you may need to reauthorize in settings."
        );
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
      const results = await getter(token, "fitbit/getAccessToken");
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
          {authorized ? (
            <>
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
                    onChange={(e) => setFromDate(e.target.value)}
                  ></Input>
                  <p>to {new Date().toDateString()}</p>
                </FormGroup>
                <Button
                  className={`${classes.modalBtn} ${classes.activitiesBtn}`}
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
                                  <h5 style={{ color: "green" }}>
                                    Added &#10003;
                                  </h5>
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
            </>
          ) : (
            <FitbitAuth userInfo={props.userInfo} />
          )}
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
