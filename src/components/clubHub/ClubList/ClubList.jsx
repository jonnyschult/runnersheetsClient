import ClubAdderModal from "./ClubAdderModal";
import UpdateRemoveClubModal from "./UpdatRemoveClubModal";
import classes from "../Club.module.css";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const ClubList = (props) => {
  return (
    <div>
      <Card className={classes.leftContainerCard}>
        <CardBody className={classes.leftContainerCardBody}>
          <CardTitle className={classes.leftContainerCardTitle}>
            Clubs
          </CardTitle>
          {props.clubs.length > 0 ? (
            props.clubs.map((club, index) => {
              return (
                <div className={`${classes.cardItem} ${classes.clubListItem}`}>
                  <CardText
                    className={`${classes.cardItem}`}
                    key={index}
                    onClick={async (e) => {
                      await props.setChairpersons([]); //prevents error for ClubChairs  <i>{props.coachRole[index].role}</i>. Without, it would index too many times.
                      props.fetchChairpersons(club.id);
                      props.fetchAthletes(club.id);
                      props.setSelectedClub(club);
                      // props.setClubActivities([]);
                    }}
                  >
                    <b>{club.clubName}</b> <i>{club.role}</i>
                  </CardText>
                  <UpdateRemoveClubModal
                    club={club}
                    token={props.token}
                    setUpdate={props.setUpdate}
                    setSelectedClub={props.setSelectedClub}
                  />
                </div>
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <ClubAdderModal
          token={props.token}
          setLoading={props.setLoading}
          loading={props.loading}
          setUpdate={props.setUpdate}
          update={props.update}
          selectedClub={props.selectedClub}
          setSelectedClub={props.setSelectedClub}
        />
      </Card>
    </div>
  );
};

export default ClubList;
