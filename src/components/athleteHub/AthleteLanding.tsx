import React, { useEffect, useState } from "react";
import APIURL from "../../utilities/environment";
import classes from "./Athlete.module.css";
import AdderCard from "./activities/AdderCard";
import RunTable from "./activities/RunTable";
import AthleteTeamList from "./AthleteTeamLists";
import AthleteClubsList from "./AthleteClubsList";
import AthleteInfo from "./AthleteInfo";
import AthleteDateFetch from "./AthleteDateFetcher";
import ChartsAndGraphs from "../charts/ChartsAndGraphs";
import { Container, Spinner } from "reactstrap";

const AthleteLanding = (props) => {
  const [fitbitRuns, setFitbitRuns] = useState([]);
  const [runs, setRuns] = useState();
  const [update, setUpdate] = useState();
  const [teams, setTeams] = useState();
  const [clubs, setClubs] = useState();
  const [athlete, setAthlete] = useState();
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 604800000).getTime()
  ); //One week ago.
  const [endDate, setEndDate] = useState(new Date(Date.now()).getTime());
  const [loadingMain1, setLoadingMain1] = useState(true);
  const [loadingMain2, setLoadingMain2] = useState(true);

  /************************
  AUTO FETCH ACTIVITIES BY DATE
  ************************/
  useEffect(() => {
    fetch(
      `${APIURL}/activity/getActivitiesDate?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        const dateDescRuns = data.result.sort(
          //Sorts runs by date in descending order
          (runA, runB) => runB.date - runA.date
        );
        await setRuns(dateDescRuns);
        setLoadingMain2(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fitbitRuns, startDate, endDate, update]);

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
        console.log(data);
        await setAthlete(data.athlete);
        await setTeams(data.athlete.teams);
        await setClubs(data.athlete.clubs);
        await setLoadingMain1(false);
      })
      .catch(async (err) => {
        console.log(err);
        await setLoadingMain1(false);
      });
  }, [update]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainDiv}>
        {loadingMain1 || loadingMain2 ? (
          <Spinner></Spinner>
        ) : (
          <div>
            <h1 className={classes.athleteLandingHeader}>
              {`${athlete.firstName}'s Workouts`}
            </h1>
            <div style={{ display: "flex" }}>
              <Container className={classes.leftContainer}>
                <AthleteClubsList
                  token={props.token}
                  clubs={clubs}
                  setUpdate={setUpdate}
                />
                <AthleteTeamList token={props.token} teams={teams} />
                <AthleteInfo
                  token={props.token}
                  setUpdate={setUpdate}
                  athlete={athlete}
                />
              </Container>
              <Container className={classes.middleContainer}>
                <RunTable
                  runs={runs}
                  token={props.token}
                  setUpdate={setUpdate}
                />
                <ChartsAndGraphs runs={runs} />
              </Container>
              <Container className={classes.rightContainer}>
                <AthleteDateFetch
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
                <AdderCard
                  token={props.token}
                  fitbitRuns={fitbitRuns}
                  setFitbitRuns={setFitbitRuns}
                  setUpdate={setUpdate}
                  update={update}
                />
              </Container>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteLanding;
