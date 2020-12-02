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
  const [update, setUpdate] = useState();
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
        const fitbitId = await data.result.map((run) => {
          //Gets fitbit Ids so user can see runs already adder in the fitbitAdderModal
          if (run.fitbitId != null) {
            return parseInt(run.fitbitId);
          }
        });
        const dateDescRuns = data.result.sort(
          //Sorts runs by date in descending order
          (runA, runB) => runB.date - runA.date
        );
        await setRuns(dateDescRuns);
        await setAlreadyAdded(fitbitId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fitbitRuns, update]);

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
        await setAthlete(data.athlete);
        await setTeams(data.athlete.teams);
        await setLoadingMain(false);
      })
      .catch(async (err) => {
        console.log(err);
        await setLoadingMain(false);
      });
  }, [update]);

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
              <AthleteInfo
                token={props.token}
                setUpdate={setUpdate}
                athlete={athlete}
              />
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
                setUpdate={setUpdate}
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
