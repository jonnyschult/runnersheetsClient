import TeamAdderModal from "./TeamAdderModal";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const TeamList = (props) => {
  return (
    <div>
      <Card className="bookCard">
        <CardBody className="">
          <CardTitle className="bookCardBodyTitle" tag="h4">
            Teams
          </CardTitle>
          {props.teams.length > 0 ? (
            props.teams.map((team, index) => {
              return (
                <CardText
                  key={index}
                  onClick={async (e) => {
                    await props.setCoaches([]); //prevents error for TeamStaff  <i>{props.coachRole[index].role}</i>. Without, it would index too many times.
                    props.fetchStaff(team.id);
                    props.fetchAthletes(team.id);
                    props.setSelectedTeam(team);
                    props.setTeamActivities([]);
                  }}
                >
                  <b>{team.teamName}</b> <i>{props.coachTeams[index].role}</i>
                </CardText>
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <TeamAdderModal
          token={props.token}
          setLoading={props.setLoading}
          setResponse={props.setResponse}
        />
      </Card>
    </div>
  );
};

export default TeamList;
