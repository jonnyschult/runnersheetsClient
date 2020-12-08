import React, { useState, useEffect } from "react";
import APIURL from "../../../../helpers/environment";
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

const FitbitAdderModal = (props) => {
  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [loading, setLoading] = useState();
  const [err, setErr] = useState();
  const [alreadyAdded, setAlreadyAdded] = useState();

  const toggle = () => setModal(!modal);

  /***************************
  GET FITBIT IDS TO CHECK IF ALREADY ADDED
  ***************************/
  useEffect(() => {
    fetch(`${APIURL}/activity/getActivities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const fitbitId = await data.result.map((run) => {
          //Gets fitbit Ids so user can see runs already adder in the fitbitAdderModal
          if (run.fitbitId != null) {
            return parseInt(run.fitbitId);
          }
        });
        await setAlreadyAdded(fitbitId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.update]);

  /***************************
  ADD FITBIT ACTIVITY TO DATABASE
  ***************************/
  const runAdder = async (runObj) => {
    fetch(`${APIURL}/activity/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        date: new Date(runObj.startTime).getTime(),
        meters: runObj.distance * 1000,
        durationSecs: runObj.activeDuration / 1000,
        elevationMeters: runObj.elevationGain,
        avgHR: runObj.averageHeartRate,
        maxHR: null,
        description: null,
        stravaId: null,
        garminId: null,
        fitbitId: runObj.logId,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        await props.setUpdate(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /***************************
  REMOVE FITBIT ACTIVITY FROM DATABASE
  ***************************/
  const runRemover = async (runObj) => {
    fetch(`${APIURL}/activity/removeActivity`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        fitbitId: runObj.logId,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        await props.setUpdate(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /***************************
  GET FITBIT ACTIVITY FROM FITBIT
  ***************************/
  const fitbitActivitiesFetcher = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/user/getAthlete`, {
      //Gets refresh token 64encoded client id and client secret
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.athlete.fitbitRefresh === null) {
          throw new Error("Account Not Associated with fitbit");
        }
        fetch(
          `https://api.fitbit.com/oauth2/token?&grant_type=refresh_token&refresh_token=${data.athlete.fitbitRefresh}`, //refreshes the refresh token and gives access token.
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${data.authorization}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            fetch(`${APIURL}/user/updateUser`, {
              //Saves new update token to database
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: props.token,
              },
              body: JSON.stringify({
                fitbitRefresh: data.refresh_token,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Hello", data.message);
              })
              .catch((err) => {
                setLoading(false);
                setErr(err);
                setTimeout(() => {
                  setErr("");
                }, 3000);
              });
            fetch(
              `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${startDate}&sort=desc&offset=0&limit=100`,
              {
                //get's fitbit data
                headers: {
                  Authorization: `Bearer ${data.access_token}`,
                },
              }
            )
              .then((res) => res.json())
              .then(async (data) => {
                const runs = await data.activities.filter(
                  (activity) =>
                    activity.activityName === "Run" && activity.distance > 0.05
                );
                await props.setFitbitRuns(runs);
                setLoading(false);
              })
              .catch((err) => {
                setLoading(false);
                setErr(err);
                setTimeout(() => {
                  setErr("");
                }, 3000);
              });
          })
          .catch((err) => {
            setLoading(false);
            setErr(err);
            setTimeout(() => {
              setErr("");
            }, 3000);
          });
      })
      .catch((err) => {
        setLoading(false);
        setErr(err);
        setTimeout(() => {
          setErr("");
        }, 3000);
      });
  };

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault(e)}>
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
          {props.fitbitRuns ? (
            <Table>
              <h5>Runs</h5>
              {loading ? <Spinner></Spinner> : <></>}
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
                {props.fitbitRuns.map((run, index) => {
                  return (
                    <tr className={classes.tr} key={index}>
                      <th scope="row">{index + 1}</th>
                      <td className={classes.td}>
                        {new Date(run.startTime).toDateString()}
                      </td>
                      <td className={classes.td}>{run.distance.toFixed(2)}</td>
                      <td className={classes.td}>
                        {new Date(run.activeDuration)
                          .toISOString()
                          .substr(11, 8)}
                      </td>
                      <td className={classes.td}>
                        {new Date(run.pace * 1000).toISOString().substr(11, 8)}
                      </td>
                      <td className={classes.td}>
                        {run.elevationGain.toFixed(2)}
                      </td>
                      <td className={classes.td}>{run.averageHeartRate}</td>
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
                        <Button onClick={(e) => runAdder(run)}>Add Run</Button>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <></>
          )}

          {err ? (
            <Alert className={classes.errAlert}>{err.message}</Alert>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={toggle}
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FitbitAdderModal;
