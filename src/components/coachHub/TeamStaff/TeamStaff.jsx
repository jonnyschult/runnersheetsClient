import React, { useState, useEffect } from "react";
import classes from "../Coach.module.css";
import CoachAdderModal from "./CoachAdderModal";
import StaffModal from "./StaffModal";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";

const TeamStaff = (props) => {
  return (
    <div>
      <Card className={classes.leftContainerCard}>
        <CardBody className={classes.leftContainerCardBody}>
          <CardTitle className={classes.leftContainerCardTitle}>
            Staff
          </CardTitle>
          {props.coaches.length > 0 ? (
            props.coaches.map((coach, index) => {
              return (
                <StaffModal
                  key={index}
                  coach={coach}
                  selectedTeam={props.selectedTeam}
                  fetchStaff={props.fetchStaff}
                  token={props.token}
                />
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <CoachAdderModal
          fetchStaff={props.fetchStaff}
          selectedTeam={props.selectedTeam}
          token={props.token}
        />
      </Card>
    </div>
  );
};

export default TeamStaff;
