import React, { useState, useEffect } from "react";
import APIURL from "../../helpers/environment";
import TeamList from "./TeamList/TeamList";
import TeamPlans from "./TeamPlans";
import RunCard from "./Activities/RunCard";
import TeamAthletes from "./TeamAthletes/TeamAthletes";
import TeamStaff from "./TeamStaff/TeamStaff";
import FetchDetailer from "./Activities/FetchDates";
import { Button, Container } from "reactstrap";

const CoachLanding = (props) => {
  const [teams, setTeams] = useState([]);
  const [coachTeams, setCoachTeams] = useState();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState();
  const [coaches, setCoaches] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [athletes, setAthletes] = useState();
  const [teamActivities, setTeamActivities] = useState();
  const [startDate, setStartDate] = useState(new Date(Date.now() - 604800000));
  const [endDate, setEndDate] = useState(new Date(Date.now()));

  /************************
  AUTO FETCH TEAMS
  ************************/
  useEffect(() => {
    fetch(`${APIURL}/coach/coachTeams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        await setCoachTeams(data.coachTeams);
        await setTeams(data.teams);
      })
      .catch((err) => console.log(err));
  }, [response]);

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
        await setCoaches(
          data.coachInfo.map((coach, index) => {
            coach.role = data.teamCoaches[index].role;
            return coach;
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
        await setAthletes(data.athleteInfo);
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  /************************
  AUTO FETCH ATHLETES' ACTIVITIES
  ************************/
  useEffect(() => {
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
        setLoading(true);
        await setTeamActivities(data.teamActivities);
        setLoading(false);
        console.log(data.teamActivities);
      })
      .catch((err) => console.log(err));
  }, [selectedTeam, startDate, endDate]);

  return (
    <div>
      <h2>
        {selectedTeam.teamName ? selectedTeam.teamName : <>Select a Team</>}
      </h2>
      <div style={{ display: "flex" }}>
        <Container>
          <TeamList
            token={props.token}
            teams={teams}
            coachTeams={coachTeams}
            setResponse={setResponse}
            setLoading={setLoading}
            response={response}
            loading={loading}
            fetchStaff={fetchStaff}
            fetchAthletes={fetchAthletes}
            setSelectedTeam={setSelectedTeam}
            setCoaches={setCoaches}
            setTeamActivities={setTeamActivities}
          />
          <TeamStaff
            token={props.token}
            coaches={coaches}
            selectedTeam={selectedTeam}
            fetchStaff={fetchStaff}
          />
          <TeamAthletes
            token={props.token}
            athletes={athletes}
            selectedTeam={selectedTeam}
            fetchAthletes={fetchAthletes}
          />
        </Container>
        <Container>
          {/* <Button onClick={fetchActivities}> Clicker you!</Button> */}
          {teamActivities ? (
            teamActivities.map((athlete, index) => {
              return <RunCard athlete={athlete} />;
            })
          ) : (
            <></>
          )}
        </Container>
        <Container>
          <FetchDetailer
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            teamActivities={teamActivities}
          />
          <TeamPlans />
        </Container>
      </div>
    </div>
  );
};

export default CoachLanding;
