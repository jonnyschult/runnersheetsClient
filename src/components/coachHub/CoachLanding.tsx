import React, { useState, useEffect } from "react";
import APIURL from "../../utilities/environment";
import classes from "./Coach.module.css";
import TeamList from "./TeamList/TeamList";
// import TeamPlans from "./TeamPlans";
import RunCard from "./Activities/RunCard";
import TeamAthletes from "./TeamAthletes/TeamAthletes";
import TeamStaff from "./TeamStaff/TeamStaff";
import FetchDates from "./Activities/FetchDates";
import Scatter from "../charts/DistanceScatter"
import "./Print.css";
import { Container, Spinner } from "reactstrap";
import {Team, UserInfo, User, Activity} from '../../models'
import getter from "../../utilities/getFetcher";

interface CoachLandingProps {
  userInfo: UserInfo
}

const CoachLanding:React.FC<CoachLandingProps> = (props) => {
  const token = props.userInfo.token
  const [teams, setTeams] = useState<Team[]>(props.userInfo.teams);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMain, setLoadingMain] = useState<boolean>(true);
  const [coaches, setCoaches] = useState<User[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team>(props.userInfo.teams[0]);
  const [athletes, setAthletes] = useState<User[]>([]);
  const [teamActivities, setTeamActivities] = useState<Activity[]>();
  const [startDate, setStartDate] = useState<number>(
    new Date(Date.now() - 604800000).getTime()
  );
  const [endDate, setEndDate] = useState<number>(new Date(Date.now()).getTime());

  /************************
  ONCLICK FETCH STAFF
  ************************/
  const fetchStaff = (team) => {
    fetch(`${APIURL}/coach/getCoaches/${team}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const coachData = await data.coaches.map((coach) => {
          //function to collate coach info with role
          data.roles.forEach((role) => {
            if (coach.id === role.userId) {
              coach.role = role.role;
            }
          });
          return coach;
        });
        await setCoaches(
          coachData.sort((a, b) => {
            if (a.lastName < b.lastName) {
              return -1;
            }
            if (a.lastName > b.lastName) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((err) => console.log(err));
  };

  /************************
  ONCLICK FETCH ATHLETES
  ************************/
  const fetchAthletes = (team) => {
    fetch(`${APIURL}/coach/getAthletes/${team}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        await setAthletes(
          data.athleteInfo.sort((a, b) => {
            if (a.lastName < b.lastName) {
              return -1;
            }
            if (a.lastName > b.lastName) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((err) => console.log(err));
  };

  /************************
  AUTO FETCH ATHLETES' ACTIVITIES
  ************************/
  useEffect(() => {
    const loadUpHandler = async () =>{
      try {
        const teamsResults = await getter(token, `teams/getTeamMembers/${selectedTeam ? selectedTeam.id : props.userInfo.teams[0].id}`)
        const activitiesResults = await getter(token, `teams/getTeamActivities/${selectedTeam ? selectedTeam.id : props.userInfo.teams[0].id}`, `start_date=${startDate}&end_date=${endDate}`)
        setCoaches([...teamsResults.data.coaches, ...teamsResults.data.managers])
        setAthletes(teamsResults.data.athletes); 
        setTeamActivities(activitiesResults.data.activities)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingMain(false)
      }

    }
    loadUpHandler
  }, [selectedTeam, startDate, endDate]);

  return (
    <div className={classes.wrapper}>
    <div className={classes.mainDiv}>
      {loadingMain ? (
        <Spinner></Spinner>
      ) : (
        <div>
          <h2 className={classes.coachLandingHeader}>
            {selectedTeam.teamName ? selectedTeam.teamName : <>Select a Team</>}
          </h2>
          <div style={{ display: "flex" }}>
            <Container className={classes.leftContainer}>
              <TeamList
                token={props.token}
                teams={teams}
                setUpdate={setUpdate}
                setLoading={setLoading}
                update={update}
                loading={loading}
                fetchStaff={fetchStaff}
                fetchAthletes={fetchAthletes}
                setSelectedTeam={setSelectedTeam}
                setCoaches={setCoaches}
                setTeamActivities={setTeamActivities}
                selectedTeam={selectedTeam}
              />
              <TeamStaff
                token={props.token}
                coaches={coaches}
                selectedTeam={selectedTeam}
                fetchStaff={fetchStaff}
              />
              <TeamAthletes
                token={props.token}
                setUpdate={setUpdate}
                athletes={athletes}
                selectedTeam={selectedTeam}
                fetchAthletes={fetchAthletes}
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
      )}
    </div>
    </div>
  );
};

export default CoachLanding;
