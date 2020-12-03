import React, { useState, useEffect } from "react";
import AthleteAddedModal from "./AthleteAdderModal";
import AthleteModal from "./AthleteModal";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";

const TeamAthletes = (props) => {
  const addAthlete = () => {
    alert("TEAM CREATED");
  };
  return (
    <div>
      <Card className="bookCard">
        <CardBody className="">
          <CardTitle className="bookCardBodyTitle" tag="h5">
            Athletes
          </CardTitle>
          {props.athletes ? (
            props.athletes.map((athlete, index) => {
              return (
                <AthleteModal
                  key={index}
                  athlete={athlete}
                  selectedTeam={props.selectedTeam}
                  fetchAthletes={props.fetchAthletes}
                  token={props.token}
                  setUpdate={props.setUpdate}
                />
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <AthleteAddedModal
          fetchAthletes={props.fetchAthletes}
          selectedTeam={props.selectedTeam}
          token={props.token}
          setUpdate={props.setUpdate}
        />
      </Card>
    </div>
  );
};

export default TeamAthletes;
