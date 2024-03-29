import TeamAdderModal from "./TeamAdderModal";
import UpdateRemoveTeam from "./UpdateRemoveTeam";
import classes from "../Coach.module.css";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Team, UserInfo } from "../../../models";

interface TeamListProps {
  userInfo: UserInfo;
  teams: Team[];
  selectedTeam: Team | null;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
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
                <div
                  className={`${classes.cardItem} ${classes.editItem}`}
                  key={index}
                >
                  <CardText
                    className={classes.cardItem}
                    key={index}
                    onClick={async (e) => {
                      props.setSelectedTeam(team);
                    }}
                  >
                    <b>{team.team_name}</b> <i>{team.role}</i>
                  </CardText>
                  <UpdateRemoveTeam
                    userInfo={props.userInfo}
                    team={team}
                    teams={props.teams}
                    setTeams={props.setTeams}
                    setSelectedTeam={props.setSelectedTeam}
                  />
                </div>
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
