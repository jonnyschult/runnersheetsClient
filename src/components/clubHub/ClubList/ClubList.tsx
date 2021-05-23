import ClubAdderModal from "./ClubAdderModal";
import UpdateRemoveClubModal from "./UpdatRemoveClubModal";
import classes from "../Club.module.css";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Club, UserInfo } from "../../../models";

interface ClubListProps {
  userInfo: UserInfo;
  clubs: Club[];
  selectedClub: Club | null;
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
  setSelectedClub: React.Dispatch<React.SetStateAction<Club | null>>;
}

const ClubList: React.FC<ClubListProps> = (props) => {
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
                <div
                  className={`${classes.cardItem} ${classes.clubListItem}`}
                  key={index}
                >
                  <CardText
                    className={`${classes.cardItem}`}
                    onClick={async (e) => {
                      props.setSelectedClub(club);
                    }}
                  >
                    <b>{club.club_name}</b>
                  </CardText>
                  <UpdateRemoveClubModal
                    userInfo={props.userInfo}
                    club={club}
                    clubs={props.clubs}
                    setClubs={props.setClubs}
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
          userInfo={props.userInfo}
          clubs={props.clubs}
          selectedClub={props.selectedClub}
          setClubs={props.setClubs}
          setSelectedClub={props.setSelectedClub}
        />
      </Card>
    </div>
  );
};

export default ClubList;
