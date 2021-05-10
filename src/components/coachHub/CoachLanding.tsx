import React, { useState, useEffect, useCallback } from "react";
import classes from "./Coach.module.css";
import ErrorPage from "../ErrorPage/ErrorPage";
import TeamList from "./TeamList/TeamList";
// import TeamPlans from "./TeamPlans";
import RunCard from "./Activities/RunCard";
import TeamAthletes from "./TeamAthletes/TeamAthletes";
import TeamStaff from "./TeamStaff/TeamStaff";
import FetchDates from "./Activities/FetchDates";
import Scatter from "../charts/DistanceScatter";
import "./Print.css";
import { Container, Spinner } from "reactstrap";
import { Team, UserInfo, User, Activity } from "../../models";
import getter from "../../utilities/getFetcher";

interface CoachLandingProps {
  userInfo: UserInfo;
}

const CoachLanding: React.FC<CoachLandingProps> = (props) => {
  const token = props.userInfo.token;
  const [teams, setTeams] = useState<Team[]>(props.userInfo.teams);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loadingMain, setLoadingMain] = useState<boolean>(true);
  const [staff, setStaff] = useState<User[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team>(
    props.userInfo.teams[0]
  );
  const [athletes, setAthletes] = useState<User[]>([]);
  const [teamActivities, setTeamActivities] = useState<Activity[]>();
  const [startDate, setStartDate] = useState<number>(
    new Date(Date.now() - 604800000).getTime()
  );
  const [endDate, setEndDate] = useState<number>(
    new Date(Date.now()).getTime()
  );

  const getActivities = useCallback(() => {
    async () => {
      try {
        setLoading(true);
        const activitiesResults = await getter(
          token,
          `teams/getTeamActivities/${selectedTeam.id}`,
          `start_date=${startDate}&end_date=${endDate}`
        );
        setTeamActivities(activitiesResults.data.activities);
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
    };
  }, [startDate, endDate]);

  useEffect(() => {
    const loadUpHandler = async () => {
      try {
        const teamsResults = await getter(
          token,
          `teams/getTeamMembers/${selectedTeam}`
        );
        const activitiesResults = await getter(
          token,
          `teams/getTeamActivities/${selectedTeam}`,
          `start_date=${new Date(Date.now() - 604800000).getTime()}
          &end_date=${new Date(Date.now()).getTime()}`
        );
        const coachesWithRoles = teamsResults.data.coaches.map(
          (coach: User) => (coach.role = "coach")
        );
        const managersWithRoles = teamsResults.data.managers.map(
          (manager: User) => (manager.role = "manager")
        );

        setStaff([...managersWithRoles, ...coachesWithRoles]);
        setAthletes(teamsResults.data.athletes);
        setTeamActivities(activitiesResults.data.activities);
      } catch (error) {
        console.log(error);
        setErrorPage(true);
        if (error["response"]) {
          setError(error.response.data.message);
        } else {
          setError("Problem fetching your data. Please let site admin Know.");
        }
      } finally {
        setLoadingMain(false);
      }
    };
    loadUpHandler();
  }, [selectedTeam]);

  if (errorPage) {
    return <ErrorPage errMessage={error} />;
  } else if (loadingMain) {
    return (
      <div className={`${classes.loadingMain} ${classes.wrapper}`}>
        <Spinner className={classes.spinnerMain}></Spinner>
      </div>
    );
  } else {
    return (
      <div className={classes.wrapper}>
        <div className={classes.mainDiv}>
          <div>
            <h2 className={classes.coachLandingHeader}>
              {selectedTeam === null
                ? props.userInfo.teams[0].team_name
                : selectedTeam.team_name}
            </h2>
            <div style={{ display: "flex" }}>
              <Container className={classes.leftContainer}>
                <TeamList
                  userInfo={props.userInfo}
                  teams={teams}
                  loading={loading}
                  selectedTeam={selectedTeam}
                  setSelectedTeam={setSelectedTeam}
                  setTeams={setTeams}
                />
                <TeamStaff
                  userInfo={props.userInfo}
                  staff={staff}
                  setStaff={setStaff}
                  selectedTeam={selectedTeam}
                />
                <TeamAthletes
                  userInfo={props.userInfo}
                  athletes={athletes}
                  setAthletes={setAthletes}
                  selectedTeam={selectedTeam}
                />
              </Container>
              <Container className={classes.middleContainer}>
                {teamActivities ? (
                  <Scatter teamActivities={teamActivities} />
                ) : (
                  <></>
                )}
                {teamActivities ? (
                  teamActivities.map((athlete, index) => {
                    return <RunCard athlete={athlete} key={index} />;
                  })
                ) : (
                  <></>
                )}
              </Container>
              <Container className={classes.rightContainer}>
                <FetchDates
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  teamActivities={teamActivities}
                />
                {/* <TeamPlans /> */}
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CoachLanding;
