import React from "react";
import classes from "./Athlete.module.css";
import RemoveClubModal from "./RemoveClubModal";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Club, UserInfo } from "../../models";

interface ClubListProps {
  userInfo: UserInfo;
  clubs: Club[];
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
}

const ClubList: React.FC<ClubListProps> = (props) => {
  return (
    <div>
      <Card className={classes.card}>
        <CardBody className={classes.cardBody}>
          <CardTitle className={classes.cardTitle} tag="h4">
            Clubs
          </CardTitle>
          {props.clubs.length > 0 ? (
            props.clubs.map((club, index) => {
              return (
                <CardText
                  key={index}
                  className={`${classes.cardItem} ${classes.clubListItem}`}
                >
                  <b>{club.club_name}</b>
                  <RemoveClubModal
                    club={club}
                    userInfo={props.userInfo}
                    clubs={props.clubs}
                    setClubs={props.setClubs}
                  />
                </CardText>
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ClubList;
