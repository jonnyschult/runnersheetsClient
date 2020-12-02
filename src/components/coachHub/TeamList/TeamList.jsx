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
                  <b>{team.teamName}</b> <i>{team.role}</i>
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
          loading={props.loading}
          setUpdate={props.setUpdate}
          update={props.update}
          selectedTeam={props.selectedTeam}
          setSelectedTeam={props.setSelectedTeam}
        />
      </Card>
    </div>
  );
};

export default TeamList;
