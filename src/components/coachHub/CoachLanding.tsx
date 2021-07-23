import React, { useState, useEffect } from "react";
import classes from "./Coach.module.css";
import ErrorPage from "../ErrorPage/ErrorPage";
import TeamList from "./TeamList/TeamList";
import RunCard from "./Activities/RunCard";
import TeamAthletes from "./TeamAthletes/TeamAthletes";
import TeamStaff from "./TeamStaff/TeamStaff";
import FetchDates from "./Activities/SetDates";
import CollatedWorkouts from "./Activities/CollatedWorkouts";
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
  const [loadingMain, setLoadingMain] = useState<boolean>(false);
  const [staff, setStaff] = useState<User[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(
    props.userInfo.teams.length > 0 ? props.userInfo.teams[0] : null
  );
  const [athletes, setAthletes] = useState<User[]>([]);
  const [teamActivities, setTeamActivities] = useState<Activity[]>([]);
  const [startDate, setStartDate] = useState<number>(
    new Date(Date.now() - 604800000).getTime()
  );
  const [endDate, setEndDate] = useState<number>(
    new Date(Date.now()).getTime()
  );

  useEffect(() => {
    const activityGetter = async () => {
      if (selectedTeam !== null) {
        try {
          setLoading(true);
          const activitiesResults = await getter(
            token,
            `teams/getTeamActivities/${selectedTeam.id}`,
            `start_date=${startDate}&end_date=${endDate}`
          );
          const sortedActivities: Activity[] =
            activitiesResults.data.activities.sort(
              (a: Activity, b: Activity) => +a.date > +b.date
            );
          setTeamActivities(sortedActivities);
        } catch (error) {
          console.log(error);
          setErrorPage(true);
          if (error.response) {
            setError(error.response.data.message);
          } else {
            setError("Problem fetching your data.  .");
          }
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (selectedTeam !== null) {
      activityGetter();
    } else {
      setTeamActivities([]);
    }
  }, [startDate, endDate, selectedTeam, token]);

  useEffect(() => {
    const teamMatesGetter = async () => {
      try {
        const teamMembersResults = await getter(
          token,
          `teams/getTeamMembers/${selectedTeam!.id}`
        );
        const coachesWithRoles = teamMembersResults.data.coaches.map(
          (coach: User) => {
            coach.role = "coach";
            return coach;
          }
        );
        const managersWithRoles = teamMembersResults.data.managers.map(
          (manager: User) => {
            manager.role = "manager";
            return manager;
          }
        );
        const sortedStaff = [...managersWithRoles, ...coachesWithRoles].sort(
          (a: User, b: User) => {
            if (a.last_name > b.last_name) {
              return 1;
            } else {
              return -1;
            }
          }
        );
        const sortedAthletes = teamMembersResults.data.athletes.sort(
          (a: User, b: User) => {
            if (a.last_name > b.last_name) {
              return 1;
            } else {
              return -1;
            }
          }
        );
        setStaff(sortedStaff);
        setAthletes(sortedAthletes);
      } catch (error) {
        console.log(error);
        setErrorPage(true);
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Problem fetching your data.  .");
        }
      } finally {
        setLoadingMain(false);
      }
    };

    if (selectedTeam !== null) {
      teamMatesGetter();
    } else {
      setStaff([]);
      setAthletes([]);
    }
  }, [selectedTeam, token]);

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
              {selectedTeam !== null
                ? selectedTeam.team_name
                : props.userInfo.teams.length > 0
                ? props.userInfo.teams[0]
                : "Select or Create a Team"}
            </h2>
            <div style={{ display: "flex" }}>
              <Container className={classes.leftContainer}>
                <TeamList
                  userInfo={props.userInfo}
                  teams={teams}
                  selectedTeam={selectedTeam}
                  setSelectedTeam={setSelectedTeam}
                  setTeams={setTeams}
                />
                <TeamStaff
                  userInfo={props.userInfo}
                  staff={staff}
                  selectedTeam={selectedTeam}
                  setStaff={setStaff}
                />
                <TeamAthletes
                  userInfo={props.userInfo}
                  athletes={athletes}
                  selectedTeam={selectedTeam}
                  setAthletes={setAthletes}
                />
              </Container>
              <Container className={classes.middleContainer}>
                {loading ? (
                  <Spinner></Spinner>
                ) : teamActivities ? (
                  <Scatter activities={teamActivities} athletes={athletes} />
                ) : (
                  <></>
                )}
                {athletes && teamActivities ? (
                  athletes.map((athlete, index) => {
                    return (
                      <RunCard
                        athleteActivities={teamActivities.filter(
                          (activity) => activity.user_id === athlete.id
                        )}
                        athlete={athlete}
                        key={index}
                      />
                    );
                  })
                ) : (
                  <></>
                )}
              </Container>

              <Container className={classes.rightContainer}>
                <FetchDates
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
                <div className={classes.collatedWorkoutsContainer}>
                  <legend className={classes.collatedWorkoutsLegend}>
                    View Collated Workouts
                  </legend>
                  <CollatedWorkouts
                    activities={teamActivities}
                    athletes={athletes}
                  />
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CoachLanding;
