import React from "react";
import classes from "../Club.module.css";
import AthleteAddedModal from "./AthleteAdderModal";
import AthleteModal from './AthleteModal'
import { Card, CardBody, CardTitle } from "reactstrap";

const ClubAthletes = (props) => {
  return (
    <div>
      <Card className={classes.leftContainerCard}>
        <CardBody className={classes.leftContainerCardBody}>
          <CardTitle className={classes.leftContainerCardTitle}>
            Members
          </CardTitle>
          {props.athletes ? (
            props.athletes.map((athlete, index) => {
              return (
                <AthleteModal
                  key={index}
                  athlete={athlete}
                  selectedClub={props.selectedClub}
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
          selectedClub={props.selectedClub}
          token={props.token}
          setUpdate={props.setUpdate}
        />
      </Card>
    </div>
  );
};

export default ClubAthletes;
