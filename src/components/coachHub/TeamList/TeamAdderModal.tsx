import React, { useState } from "react";
import classes from "../Coach.module.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Label,
  Input,
  Form,
  Alert,
  Spinner,
} from "reactstrap";
import { UserInfo, Team } from "../../../models";
import poster from "../../../utilities/postFetcher";

interface TeamAdderModalProps {
  userInfo: UserInfo;
  selectedTeam: Team | null;
  teams: Team[];
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamAdderModal: React.FC<TeamAdderModalProps> = (props) => {
  const token = props.userInfo.token;
  const [modal, setModal] = useState<boolean>(false);
  const [teamTitle, setTeamTitle] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const toggle = () => setModal(!modal);

  const createTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const info: Team = {
        team_name: teamTitle,
      };
      const teamResults = await poster(token, "teams/create", info);
      const newTeam: Team = teamResults.data.newTeam;
      setResponse(teamResults.data.message);
      const sortedTeams = [...props.teams, newTeam].sort((a: Team, b: Team) => {
        if (a.team_name > b.team_name) {
          return 1;
        } else {
          return -1;
        }
      });
      props.setTeams(sortedTeams);
      props.userInfo.teams = sortedTeams;
      props.userInfo.setUserInfo!(props.userInfo);
      props.setSelectedTeam(newTeam);
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not create team team. Server error");
      }
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} className={classes.adderModalButton}>
          +
        </Button>
      </Form>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} className={classes.modalHeader}>
          <header className={classes.headerText}>
            Create a Team and Start Coaching!
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form onSubmit={(e) => createTeam(e)}>
            <Label htmlFor="team name">Choose a Team Name</Label>
            <Input
              required
              type="text"
              name="tean name"
              placeholder="e. g. Girls Varsity Cross Country"
              onChange={(e) => setTeamTitle(e.target.value)}
            ></Input>
            <Button
              className={`${classes.modalBtn} ${classes.addBtn}`}
              type="submit"
            >
              Create
            </Button>
            {loading ? <Spinner color="primary" /> : <></>}
            {response ? (
              <Alert className={classes.responseAlert}>{response}</Alert>
            ) : (
              <></>
            )}
          </Form>
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
            onClick={toggle}
          >
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TeamAdderModal;
