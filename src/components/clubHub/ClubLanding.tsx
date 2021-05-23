import React, { useState, useEffect } from "react";
import ErrorPage from "../ErrorPage/ErrorPage";
import classes from "./Club.module.css";
import ClubList from "./ClubList/ClubList";
import RunCard from "./Activities/RunCard";
import ClubAthletes from "./ClubAthletes/ClubAthletes";
import Chairpersons from "./ClubChairs/Chairpersons";
import FetchDates from "./Activities/SetDates";
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
  const [clubs, setClubs] = useState<Club[]>(props.userInfo.clubs);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMain, setLoadingMain] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [chairpersons, setChairpersons] = useState<User[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(
    props.userInfo.clubs.length > 0 ? props.userInfo.clubs[0] : null
  );
  const [athletes, setAthletes] = useState<User[]>([]);
  const [clubActivities, setClubActivities] = useState<Activity[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 604800000).getTime()
  );
  const [endDate, setEndDate] = useState(new Date(Date.now()).getTime());

  useEffect(() => {
    const clubActivitiesFetcher = async () => {
      try {
        setLoading(true);
        const activitiesResults = await getter(
          token,
          `clubs/getClubActivities/${selectedClub!.id}`,
          `start_date=${startDate}&end_date=${endDate}`
        );
        if (activitiesResults.data.activities.length > 0) {
          const sortedActivities: Activity[] =
            activitiesResults.data.activities.sort(
              (a: Activity, b: Activity) => {
                if (new Date(+a.date).getTime() > new Date(+b.date).getTime()) {
                  return 1;
                } else {
                  return -1;
                }
              }
            );
          console.log(sortedActivities);
          setClubActivities(sortedActivities ? sortedActivities : []);
        } else {
          setClubActivities([]);
        }
      } catch (error) {
        console.log(error);
        setErrorPage(true);
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Problem fetching your data. Please let site admin Know.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (selectedClub !== null) {
      clubActivitiesFetcher();
    }
  }, [startDate, endDate, selectedClub, token]);

  useEffect(() => {
    const loadUpHandler = async () => {
      try {
        setLoadingMain(true);
        const clubResults = await getter(
          token,
          `clubs/getClubMembers/${selectedClub!.id}`
        );

        const viceChairsWithRoles: User[] = clubResults.data.viceChairs.map(
          (viceChair: User) => {
            viceChair.role = "vice_chair";
            return viceChair;
          }
        );
        const chairsWithRoles: User[] = clubResults.data.chairs.map(
          (chair: User) => {
            chair.role = "chair";
            return chair;
          }
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
        const sortedAthletes: User[] = clubResults.data.athletes.sort(
          (a: User, b: User) => {
            if (a.last_name > b.last_name) {
              return 1;
            } else {
              return -1;
            }
          }
        );
        setChairpersons(sortedChairs);
        setAthletes(sortedAthletes);
      } catch (error) {
        console.log(error);
        setErrorPage(true);
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Problem fetching your data. Please let site admin Know.");
        }
      } finally {
        setLoadingMain(false);
      }
    };
    if (selectedClub !== null) {
      loadUpHandler();
    }
  }, [selectedClub, token]);

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
          <h2 className={classes.clubLandingHeader}>
            {selectedClub !== null
              ? selectedClub.club_name
              : props.userInfo.clubs.length > 0
              ? props.userInfo.clubs[0]
              : "Select or Create a Club"}
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
                clubs={clubs}
                setClubs={setClubs}
                chairpersons={chairpersons}
                selectedClub={selectedClub}
                setSelectedClub={setSelectedClub}
                setChairpersons={setChairpersons}
              />
              <ClubAthletes
                userInfo={props.userInfo}
                athletes={athletes}
                selectedClub={selectedClub}
                setAthletes={setAthletes}
              />
            </Container>
            {loading ? (
              <div className={classes.middleContainer}>
                <Spinner></Spinner>
              </div>
            ) : (
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
                  [...athletes, ...chairpersons].map((clubmember, index) => {
                    return (
                      <RunCard
                        clubMember={clubmember}
                        activities={clubActivities.filter(
                          (activity) => activity.user_id === clubmember.id
                        )}
                        key={index}
                      />
                    );
                  })
                ) : (
                  <></>
                )}
              </Container>
            )}
            <Container className={classes.rightContainer}>
              <FetchDates setStartDate={setStartDate} setEndDate={setEndDate} />
              <div className={classes.collatedWorkoutsContainer}>
                <legend className={classes.collatedWorkoutsLegend}>
                  View Collated Workouts
                </legend>
                <CollatedWorkouts
                  activities={clubActivities}
                  clubMembers={[...athletes, ...chairpersons]}
                />
              </div>
            </Container>
          </div>
        </div>
      </div>
    );
  }
};

export default ClubLanding;
