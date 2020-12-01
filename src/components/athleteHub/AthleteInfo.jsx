import React from "react";
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
          <CardText>{`Height: ${props.athlete.heightInInches}"`}</CardText>
          <CardText>{`Premium Member: ${props.athlete.isPremium}`}</CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default TeamList;
