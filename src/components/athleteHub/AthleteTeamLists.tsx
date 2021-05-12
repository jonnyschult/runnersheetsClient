import React from "react";
import classes from "./Athlete.module.css";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Team, UserInfo } from "../../models";

interface TeamListProps {
  userInfo: UserInfo;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamList: React.FC<TeamListProps> = (props) => {
  return (
    <div>
      <Card className={classes.card}>
        <CardBody className={classes.cardBody}>
          <CardTitle className={classes.cardTitle} tag="h4">
            Teams
          </CardTitle>
          {props.teams.length > 0 ? (
            props.teams.map((team, index) => {
              return (
                <CardText className={classes.cardItem}>
                  <b>{team.team_name}</b>
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
