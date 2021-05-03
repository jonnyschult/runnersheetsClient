import React, { useState, useEffect } from "react";
import APIURL from "../../utilities/environment";
import classes from "./Club.module.css";
import ClubList from "./ClubList/ClubList";
import RunCard from "./Activities/RunCard";
import ClubAthletes from "./ClubAthletes/ClubAthletes";
import Chairpersons from "./ClubChairs/Chairpersons";
import FetchDates from "./Activities/FetchDates";
import CollatedWorkouts from "./Activities/CollatedWorkouts";
import Scatter from "../charts/DistanceScatter";
import "./Print.css";

import { Container, Spinner } from "reactstrap";

const ClubLanding = (props) => {
  const [clubs, setClubs] = useState([]);
  const [update, setUpdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMain, setLoadingMain] = useState(false);
  const [chairpersons, setChairpersons] = useState([]);
  const [selectedClub, setSelectedClub] = useState(false);
  const [athletes, setAthletes] = useState();
  const [clubActivities, setClubActivities] = useState();
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 604800000).getTime()
  );
  const [endDate, setEndDate] = useState(new Date(Date.now()).getTime());

  /************************
  AUTO FETCH CLUBS
  ************************/
  useEffect(() => {
    setLoadingMain(true);
    fetch(`${APIURL}/club/getClubs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const clubData = data.clubsInfo.map((club) => {
          //function to collate club info with roles. Creates a new object and returns the combined info.
          data.clubRostersInfo.forEach((roster) => {
            if (club.id === roster.clubId) {
              club.role = roster.role;
            }
          });
          return club; //returns club object with role key value pair added to it.
        });
        if (!selectedClub) {
          await fetchChairpersons(data.clubsInfo[0].id);
          await fetchAthletes(data.clubsInfo[0].id);
          setSelectedClub(data.clubsInfo[0]);
        } else {
          fetchChairpersons(selectedClub.id);
          fetchAthletes(selectedClub.id);
        }
        setClubs(
          clubData.sort((a, b) => {
            if (a.clubName < b.clubName) {
              return -1;
            }
            if (a.clubName > b.clubName) {
              return 1;
            }
            return 0;
          })
        );
        setLoadingMain(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingMain(false);
      });
  }, [update]);

  /************************
  FETCH CHAIRPERSONS
  ************************/
  const fetchChairpersons = (club) => {
    fetch(`${APIURL}/club/getChairpersons/${club}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const chairpersonsData = await data.chairpersons.map((chairperson) => {
          //function to collate chairperson info with role
          data.roles.forEach((role) => {
            if (chairperson.id === role.userId) {
              chairperson.role = role.role;
            }
          });
          return chairperson;
        });
        await setChairpersons(
          chairpersonsData.sort((a, b) => {
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
  FETCH ATHLETES
  ************************/
  const fetchAthletes = (club) => {
    fetch(`${APIURL}/club/getAthletes/${club}`, {
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
            //sorts alphabetically
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
      `${APIURL}/club/getClubActivities/${selectedClub.id}?startDate=${startDate}&endDate=${endDate}`,
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
        await setClubActivities(data.clubActivities);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [selectedClub, startDate, endDate, update]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainDiv}>
        {loadingMain ? (
          <Spinner></Spinner>
        ) : (
          <div>
            <h2 className={classes.clubLandingHeader}>
              {selectedClub.clubName ? (
                selectedClub.clubName
              ) : (
                <>Select a Club</>
              )}
            </h2>
            <div style={{ display: "flex" }}>
              <Container className={classes.leftContainer}>
                <ClubList
                  token={props.token}
                  clubs={clubs}
                  setUpdate={setUpdate}
                  setLoading={setLoading}
                  update={update}
                  loading={loading}
                  fetchChairpersons={fetchChairpersons}
                  fetchAthletes={fetchAthletes}
                  setSelectedClub={setSelectedClub}
                  setChairpersons={setChairpersons}
                  setAthletes={setAthletes}
                  setClubActivities={setClubActivities}
                  selectedClub={selectedClub}
                />
                <Chairpersons
                  token={props.token}
                  chairpersons={chairpersons}
                  selectedClub={selectedClub}
                  fetchChairpersons={fetchChairpersons}
                />
                <ClubAthletes
                  token={props.token}
                  setUpdate={setUpdate}
                  athletes={athletes}
                  selectedClub={selectedClub}
                  fetchAthletes={fetchAthletes}
                />
              </Container>
              <Container className={classes.middleContainer}>
                {clubActivities ? (
                  <Scatter teamActivities={clubActivities} />
                ) : (
                  <></>
                )}
                {clubActivities ? (
                  clubActivities.map((athlete, index) => {
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
                  clubActivities={clubActivities}
                />
                <div className={classes.collatedWorkoutsContainer}>
                  <legend className={classes.collatedWorkoutsLegend}>
                    View Collated Workouts
                  </legend>
                  <CollatedWorkouts teamActivities={clubActivities} />
                </div>
              </Container>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubLanding;
