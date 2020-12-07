import React, { useState, useEffect } from "react";
import classes from "../Coach.module.css";
import AthleteAddedModal from "./AthleteAdderModal";
import AthleteModal from "./AthleteModal";
import { Card, CardBody, CardTitle } from "reactstrap";

const TeamAthletes = (props) => {
  return (
    <div>
      <Card className={classes.leftContainerCard}>
        <CardBody className={classes.leftContainerCardBody}>
          <CardTitle className={classes.leftContainerCardTitle}>
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
