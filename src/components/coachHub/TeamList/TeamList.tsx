import TeamAdderModal from "./TeamAdderModal";
import classes from "../Coach.module.css";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Team, UserInfo } from "../../../models";

interface TeamListProps {
  userInfo: UserInfo;
  teams: Team[];
  selectedTeam: Team;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team>>;
}

const TeamList: React.FC<TeamListProps> = (props) => {
  return (
    <div>
      <Card className={classes.leftContainerCard}>
        <CardBody className={classes.leftContainerCardBody}>
          <CardTitle className={classes.leftContainerCardTitle}>
            Teams
          </CardTitle>
          {props.teams.length > 0 ? (
            props.teams.map((team, index) => {
              return (
                <CardText
                  className={classes.cardItem}
                  key={index}
                  onClick={async (e) => {
                    props.setSelectedTeam(team);
                  }}
                >
                  <b>{team.team_name}</b> <i>{team.role}</i>
                </CardText>
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <TeamAdderModal
          userInfo={props.userInfo}
          teams={props.teams}
          setSelectedTeam={props.setSelectedTeam}
          setTeams={props.setTeams}
          selectedTeam={props.selectedTeam}
        />
      </Card>
    </div>
  );
};

export default TeamList;
