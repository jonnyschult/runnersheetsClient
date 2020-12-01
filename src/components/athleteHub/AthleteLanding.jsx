import React, { useEffect, useState } from "react";
import APIURL from "../../helpers/environment";
import AdderCard from "./AdderCard";
import ActivitiesRunCard from "./ActivitiesRunCard";
import AthleteTeamList from "./AthleteTeamLists";
import AthleteInfo from "./AthleteInfo";
import { Container, Spinner } from "reactstrap";

const AthleteLanding = (props) => {
  const [fitbitRuns, setFitbitRuns] = useState([]);
  const [runs, setRuns] = useState();
  const [response, setResponse] = useState();
  const [alreadyAdded, setAlreadyAdded] = useState([]);
  const [teams, setTeams] = useState();
  const [athlete, setAthlete] = useState();
  const [loadingMain, setLoadingMain] = useState(true);

  /************************
  AUTO FETCH ACTIVITIES
  ************************/
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

  /************************
  AUTO FETCH ATHLETE
  ************************/
  useEffect(() => {
    fetch(`${APIURL}/user/getAthlete`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data.athlete);
        await setAthlete(data.athlete);
        await setTeams(data.athlete.teams);
        await setLoadingMain(false);
      })
      .catch((err) => console.log(err));
  }, [response]);

  return (
    <div>
      {loadingMain ? (
        <Spinner></Spinner>
      ) : (
        <div>
          <h1>Hello {athlete.firstName}</h1>
          <div style={{ display: "flex" }}>
            <Container>
              <AthleteTeamList token={props.token} teams={teams} />
              <AthleteInfo athlete={athlete} />
            </Container>
            <Container>
              {runs ? (
                runs.map((run, index) => {
                  return (
                    <ActivitiesRunCard run={run} key={index} index={index} />
                  );
                })
              ) : (
                <>Run Cards or graphs</>
              )}
            </Container>
            <Container>
              <AdderCard
                token={props.token}
                fitbitRuns={fitbitRuns}
                setFitbitRuns={setFitbitRuns}
                setResponse={setResponse}
                response={response}
                alreadyAdded={alreadyAdded}
              />
            </Container>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteLanding;
