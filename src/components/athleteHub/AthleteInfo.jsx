import React from "react";
import classes from "./Athlete.module.css";
import AthleteUpdaterModal from "./AthleteUpdaterModal";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const TeamList = (props) => {
  console.log(props.athlete.DOB.substring(10, 0));
  return (
    <div>
      <Card className={classes.card}>
        <CardBody className={classes.cardBody}>
          <CardTitle className={classes.cardTitle} tag="h4">
            Athlete Information
          </CardTitle>
          <CardText className={classes.cardItem}>
            {`Name:     ${props.athlete.firstName} ${props.athlete.lastName}`}
          </CardText>
          <CardText
            className={classes.cardItem}
          >{`Email: ${props.athlete.email}`}</CardText>
          <CardText
            className={classes.cardItem}
          >{`DOB: ${props.athlete.DOB.substring(10, 0)}`}</CardText>
          <CardText className={classes.cardItem}>{`Height: ${Math.floor(
            props.athlete.heightInInches / 12
          )}'${props.athlete.heightInInches % 12}"`}</CardText>
          <CardText
            className={classes.cardItem}
          >{`Weight: ${props.athlete.weightInPounds}`}</CardText>
          <CardText
            className={classes.cardItem}
          >{`Premium Member: ${props.athlete.isPremium}`}</CardText>
          <AthleteUpdaterModal
            token={props.token}
            athlete={props.athlete}
            setUpdate={props.setUpdate}
            update={props.update}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default TeamList;
