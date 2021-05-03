import React from "react";
import classes from "./Athlete.module.css";
import RemoveClubModal from "./RemoveClubModal";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const Clubslist = (props) => {
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
                  className={`${classes.cardItem} ${classes.clubListItem}`}
                >
                  <b>{club.clubName}</b>
                  <RemoveClubModal
                    club={club}
                    token={props.token}
                    setUpdate={props.setUpdate}
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

export default Clubslist;
