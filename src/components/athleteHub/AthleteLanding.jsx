import React, { useEffect, useState } from "react";
import APIURL from "../../helpers/environment";
import FitbitAdderModal from "./fitbitFlow/FitbitAdderModal";
import ActivitiesRunCard from "./ActivitiesRunCard";
import { Button, Table } from "reactstrap";

const AthleteLanding = (props) => {
  const [fitbitRuns, setFitbitRuns] = useState([]);
  const [runs, setRuns] = useState();
  const [response, setResponse] = useState();
  const [alreadyAdded, setAlreadyAdded] = useState();

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
        console.log(data.result);
        await setRuns(data.result);
        const fitbitId = await data.result.map((run) => {
          if (run.fitbitId != null) {
            return parseInt(run.fitbitId);
          }
        });
        await setAlreadyAdded(fitbitId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fitbitRuns, response]);
  return (
    <div>
      <FitbitAdderModal
        token={props.token}
        fitbitRuns={fitbitRuns}
        setFitbitRuns={setFitbitRuns}
        setResponse={setResponse}
        response={response}
        alreadyAdded={alreadyAdded}
      />
      {runs ? (
        runs.map((run, index) => {
          return <ActivitiesRunCard run={run} key={index} index={index}/>;
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default AthleteLanding;
