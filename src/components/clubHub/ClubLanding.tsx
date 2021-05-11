import React, { useState, useEffect, useCallback } from "react";
import ErrorPage from "../ErrorPage/ErrorPage";
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
import { Activity, Club, User, UserInfo } from "../../models";
import { getter } from "../../utilities";

interface ClubLandingProps {
  userInfo: UserInfo;
}

const ClubLanding: React.FC<ClubLandingProps> = (props) => {
  const token = props.userInfo.token;
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMain, setLoadingMain] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [chairpersons, setChairpersons] = useState<User[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club>(
    props.userInfo.clubs[0]
  );
  const [athletes, setAthletes] = useState<User[]>([]);
  const [clubActivities, setClubActivities] = useState<Activity[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 604800000).getTime()
  );
  const [endDate, setEndDate] = useState(new Date(Date.now()).getTime());

  const getActivities = useCallback(() => {
    async () => {
      try {
        setLoading(true);
        const activitiesResults = await getter(
          token,
          `clubs/getClubActivities/${selectedClub.id}`,
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
        setClubActivities(sortedActivities);
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
  }, [startDate, endDate, athletes]);

  useEffect(() => {
    const loadUpHandler = async () => {
      try {
        const clubResults = await getter(
          token,
          `clubs/getClubMembers/${selectedClub}`
        );
        const activitiesResults = await getter(
          token,
          `clubs/getTeamActivities/${selectedClub}`,
          `start_date=${new Date(Date.now() - 604800000).getTime()}
          &end_date=${new Date(Date.now()).getTime()}`
        );
        const viceChairsWithRoles = clubResults.data.viceChairs.map(
          (viceChair: User) => (viceChair.role = "vice_chair")
        );
        const chairsWithRoles = clubResults.data.chairs.map(
          (chair: User) => (chair.role = "chair")
        );
        const sortedChairs = [...chairsWithRoles, ...viceChairsWithRoles].sort(
          (a: User, b: User) => {
            if (a.last_name > b.last_name) {
              return 1;
            } else {
              return -1;
            }
          }
        );
        const sortedAthletes = clubResults.data.athletes.sort(
          (a: User, b: User) => {
            if (a.last_name > b.last_name) {
              return 1;
            } else {
              return -1;
            }
          }
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
        setChairpersons(sortedChairs);
        setAthletes(sortedAthletes);
        setClubActivities(sortedActivities);
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
  }, [selectedClub]);

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
        {loading ? (
          <Spinner></Spinner>
        ) : (
          <div className={classes.mainDiv}>
            {loadingMain ? (
              <Spinner></Spinner>
            ) : (
              <div>
                <h2 className={classes.clubLandingHeader}>
                  {selectedClub.club_name ? (
                    selectedClub.club_name
                  ) : (
                    <>Select a Club</>
                  )}
                </h2>
                <div style={{ display: "flex" }}>
                  <Container className={classes.leftContainer}>
                    <ClubList
                      userInfo={props.userInfo}
                      clubs={clubs}
                      selectedClub={selectedClub}
                      setClubs={setClubs}
                      setSelectedClub={setSelectedClub}
                    />
                    <Chairpersons
                      userInfo={props.userInfo}
                      chairpersons={chairpersons}
                      selectedClub={selectedClub}
                      setChairpersons={setChairpersons}
                    />
                    <ClubAthletes
                      userInfo={props.userInfo}
                      athletes={athletes}
                      selectedClub={selectedClub}
                      setAthletes={setAthletes}
                    />
                  </Container>
                  <Container className={classes.middleContainer}>
                    {clubActivities ? (
                      <Scatter
                        activities={clubActivities}
                        athletes={[...athletes, ...chairpersons]}
                      />
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
        )}
      </div>
    );
  }
};

export default ClubLanding;
