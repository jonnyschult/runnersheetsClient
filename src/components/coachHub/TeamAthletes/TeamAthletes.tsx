import React from "react";
import classes from "../Coach.module.css";
import AthleteAdderModal from "./AthleteAdderModal";
import AthleteInfo from "./AthleteInfo";
import AthleteUpdater from "./AthleteUpdater";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Team, User, UserInfo } from "../../../models";

interface TeamAthletesProps {
  userInfo: UserInfo;
  athletes: User[];
  selectedTeam: Team | null;
  setAthletes: React.Dispatch<React.SetStateAction<User[]>>;
}

const TeamAthletes: React.FC<TeamAthletesProps> = (props) => {
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
                <div
                  key={index}
                  className={`${classes.cardItem} ${classes.editItem}`}
                >
                  <AthleteInfo athlete={athlete} userInfo={props.userInfo} />
                  <AthleteUpdater
                    athlete={athlete}
                    selectedTeam={props.selectedTeam}
                    userInfo={props.userInfo}
                    athletes={props.athletes}
                    setAthletes={props.setAthletes}
                  />
                </div>
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <AthleteAdderModal
          athletes={props.athletes}
          setAthletes={props.setAthletes}
          selectedTeam={props.selectedTeam}
          userInfo={props.userInfo}
        />
      </Card>
    </div>
  );
};

export default TeamAthletes;
