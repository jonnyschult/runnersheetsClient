import React, { useState } from "react";
import AthleteUpdaterModal from "./AthleteUpdaterModal";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const TeamList = (props) => {
  return (
    <div>
      <Card className="bookCard">
        <CardBody className="">
          <CardTitle className="bookCardBodyTitle" tag="h4">
            Athlete Information
          </CardTitle>
          <CardText>
            {`Name:     ${props.athlete.firstName} ${props.athlete.lastName}`}
          </CardText>
          <CardText>{`Email: ${props.athlete.email}`}</CardText>
          <CardText>{`Age: ${props.athlete.age}`}</CardText>
          <CardText>{`Height: ${Math.floor(
            props.athlete.heightInInches / 12
          )}'${props.athlete.heightInInches % 12}"`}</CardText>
          <CardText>{`Weight: ${props.athlete.weightInPounds}`}</CardText>
          <CardText>{`Premium Member: ${props.athlete.isPremium}`}</CardText>
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
