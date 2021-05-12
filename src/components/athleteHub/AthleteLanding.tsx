import React, { useState, useCallback } from "react";
import ErrorPage from "../ErrorPage/ErrorPage";
import classes from "./Athlete.module.css";
import AdderCard from "./activities/AdderCard";
import RunTable from "./activities/RunTable";
import AthleteTeamList from "./AthleteTeamLists";
import AthleteClubsList from "./AthleteClubsList";
import AthleteInfo from "./AthleteInfo";
import SetDates from "./SetDates";
import ChartsAndGraphs from "../charts/ChartsAndGraphs";
import { Container, Spinner } from "reactstrap";
import { Activity, Club, Team, UserInfo } from "../../models";
import { getter } from "../../utilities";

interface AthleteLandingProps {
  userInfo: UserInfo;
}

const AthleteLanding: React.FC<AthleteLandingProps> = (props) => {
  const token = props.userInfo.token;
  const athlete = props.userInfo.user;
  const [fitbitRuns, setFitbitRuns] = useState<any[]>([]);
  const [activities, setActivities] = useState<Activity[]>(
    props.userInfo.activities
  );
  const [teams, setTeams] = useState<Team[]>(props.userInfo.teams);
  const [clubs, setClubs] = useState<Club[]>(props.userInfo.clubs);
  const [startDate, setStartDate] = useState<number>(
    new Date(Date.now() - 604800000).getTime()
  ); //One week ago.
  const [endDate, setEndDate] = useState<number>(
    new Date(Date.now()).getTime()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useCallback(async () => {
    try {
      setLoading(true);
      const activitiesResults = await getter(
        token,
        `activities/getActvitiesByDate`,
        `start_date=${startDate}&end_date=${endDate}`
      );
      const sortedActivities = activitiesResults.data.activities.sort(
        (a: Activity, b: Activity) => {
          if (new Date(a.date).getTime() > new Date(b.date).getTime()) {
            return 1;
          } else {
            return -1;
          }
        }
      );
      setActivities(sortedActivities);
    } catch (error) {
      console.log(error);
      setErrorPage(true);
      if (error["response"]) {
        setError(error.response.data.message);
      } else {
        setError("Problem fetching your data. Please let site admin Know.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, token]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainDiv}>
        <div>
          <h1 className={classes.athleteLandingHeader}>
            {`${athlete.first_name}'s Workouts`}
          </h1>
          <div style={{ display: "flex" }}>
            <Container className={classes.leftContainer}>
              <AthleteClubsList
                userInfo={props.userInfo}
                clubs={clubs}
                setClubs={setClubs}
              />
              <AthleteTeamList
                userInfo={props.userInfo}
                teams={teams}
                setTeams={setTeams}
              />
              <AthleteInfo userInfo={props.userInfo} />
            </Container>
            <Container className={classes.middleContainer}>
              {loading ? (
                <div className={`${classes.loading} ${classes.wrapper}`}>
                  <Spinner className={classes.spinnerMain}></Spinner>
                </div>
              ) : errorPage ? (
                <ErrorPage errMessage={error} />
              ) : (
                <>
                  <RunTable
                    activities={activities}
                    userInfo={props.userInfo}
                    setActivities={setActivities}
                  />
                  <ChartsAndGraphs runs={activities} />{" "}
                </>
              )}
            </Container>
            <Container className={classes.rightContainer}>
              <SetDates setStartDate={setStartDate} setEndDate={setEndDate} />
              <AdderCard
                userInfo={props.userInfo}
                activities={activities}
                endDate={endDate}
                startDate={startDate}
                fitbitRuns={fitbitRuns}
                setFitbitRuns={setFitbitRuns}
                setActivities={setActivities}
              />
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteLanding;
