import React, { useState } from "react";
import APIURL from "../../../../helpers/environment";
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

  const toggle = () => setModal(!modal);

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
        <Button onClick={toggle} style={{ margin: "0 auto" }}>
          Add Fitbit Activities
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName="sheetModal"
        className="print"
      >
        <ModalHeader toggle={toggle}>Adder Modal</ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => fitbitActivitiesFetcher(e)}>
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
            <Button type="submit">Get Fitbit Activities</Button>
          </Form>
          <Table>
            <h5>Runs</h5>
            {loading ? <Spinner></Spinner> : <></>}
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Kilometers</th>
                <th>Time</th>
                <th>Pace km</th>
                <th>Elevation/m</th>
                <th>Average HR</th>
                <th>Upload</th>
              </tr>
            </thead>
            <tbody>
              {props.fitbitRuns ? (
                props.fitbitRuns.map((run, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{new Date(run.startTime).toDateString()}</td>
                      <td>{run.distance.toFixed(2)}</td>
                      <td>
                        {new Date(run.activeDuration)
                          .toISOString()
                          .substr(11, 8)}
                      </td>
                      <td>
                        {new Date(run.pace * 1000).toISOString().substr(11, 8)}
                      </td>
                      <td>{run.elevationGain.toFixed(2)}</td>
                      <td>{run.averageHeartRate}</td>
                      {props.alreadyAdded.includes(run.logId) ? (
                        <div style={{ display: "flex" }}>
                          <h5 style={{ color: "green" }}>Added &#10003;</h5>
                          <div onClick={(e) => runRemover(run)}>Undo</div>
                        </div>
                      ) : (
                        <Button onClick={(e) => runAdder(run)}>Add Run</Button>
                      )}
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
            </tbody>
          </Table>
          {err ? <Alert color="Danger">{err.message}</Alert> : <></>}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle} className="modalButton">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FitbitAdderModal;
