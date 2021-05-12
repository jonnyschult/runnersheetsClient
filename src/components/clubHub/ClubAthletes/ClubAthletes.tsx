import React from "react";
import classes from "../Club.module.css";
import AthleteAdderModal from "./AthleteAdderModal";
import AthleteModal from "./AthleteModal";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Club, User, UserInfo } from "../../../models";

interface ClubAthletesProps {
  userInfo: UserInfo;
  athletes: User[];
  selectedClub: Club | null;
  setAthletes: React.Dispatch<React.SetStateAction<User[]>>;
}

const ClubAthletes: React.FC<ClubAthletesProps> = (props) => {
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
                  userInfo={props.userInfo}
                  athlete={athlete}
                  athletes={props.athletes}
                  selectedClub={props.selectedClub}
                  setAthletes={props.setAthletes}
                />
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <AthleteAdderModal
          userInfo={props.userInfo}
          athletes={props.athletes}
          setAthletes={props.setAthletes}
          selectedClub={props.selectedClub}
        />
      </Card>
    </div>
  );
};

export default ClubAthletes;
