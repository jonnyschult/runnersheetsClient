import React from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const TeamList = (props) => {
  return (
    <div>
      <Card className="bookCard">
        <CardBody className="">
          <CardTitle className="bookCardBodyTitle" tag="h4">
            Teams
          </CardTitle>
          {props.teams.length > 0 ? (
            props.teams.map((team, index) => {
              return (
                <CardText>
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
