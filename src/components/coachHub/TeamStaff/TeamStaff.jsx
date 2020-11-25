import React, { useState, useEffect } from "react";
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
      <Card className="bookCard">
        <CardBody className="">
          <CardTitle className="bookCardBodyTitle" tag="h5">
            Staff
          </CardTitle>
          {props.coaches.length > 0 ? (
            props.coaches.map((coach, index) => {
              return (
                <StaffModal
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
