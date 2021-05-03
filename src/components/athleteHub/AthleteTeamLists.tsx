import React from "react";
import classes from "./Athlete.module.css";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const TeamList = (props) => {
  return (
    <div>
      <Card className={classes.card}>
        <CardBody className={classes.cardBody}>
          <CardTitle className={classes.cardTitle} tag="h4">
            Teams
          </CardTitle>
          {props.teams.length > 0 ? (
            props.teams.map((team, index) => {
              return (
                <CardText className={classes.cardItem}>
                  <b>{team.teamName}</b>
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

export default TeamList;
