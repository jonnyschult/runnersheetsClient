import React, { useState, useEffect } from "react";
import APIURL from "../../helpers/environment";
import classes from "./Coach.module.css";
import TeamList from "./TeamList/TeamList";
import TeamPlans from "./TeamPlans";
import RunCard from "./Activities/RunCard";
import TeamAthletes from "./TeamAthletes/TeamAthletes";
import TeamStaff from "./TeamStaff/TeamStaff";
import FetchDates from "./Activities/FetchDates";
import "./Print.css";

import { Button, Container, Spinner } from "reactstrap";

const CoachLanding = (props) => {
  const [teams, setTeams] = useState([]);
  const [update, setUpdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMain, setLoadingMain] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(false);
  const [athletes, setAthletes] = useState();
  const [teamActivities, setTeamActivities] = useState();
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 604800000).getTime()
  );
  const [endDate, setEndDate] = useState(new Date(Date.now()).getTime());

  /************************
  AUTO FETCH TEAMS
  ************************/
  useEffect(() => {
    setLoadingMain(true);
    fetch(`${APIURL}/coach/coachTeams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const teamData = data.teams.map((team) => {
          //function to collate team info with roles
          data.coachRole.forEach((role) => {
            if (team.id === role.teamId) {
              team.role = role.role;
            }
          });
          return team;
        });
        if (!selectedTeam) {
          await fetchStaff(data.teams[0].id);
          await fetchAthletes(12);
          setSelectedTeam(data.teams[0]);
        } else {
          fetchStaff(selectedTeam.id);
          fetchAthletes(selectedTeam.id);
        }
        setLoadingMain(false);
        setTeams(
          teamData.sort((a, b) => {
            if (a.teamName < b.teamName) {
              return -1;
            }
            if (a.teamName > b.teamName) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setLoadingMain(false);
      });
  }, [update]);

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
    setLoading(true);
    fetch(
      `${APIURL}/coach/getTeamActivities/${selectedTeam.id}?startDate=${startDate}&endDate=${endDate}`,
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
        await setTeamActivities(data.teamActivities);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [selectedTeam, startDate, endDate, update]);

  return (
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
  );
};

export default CoachLanding;
