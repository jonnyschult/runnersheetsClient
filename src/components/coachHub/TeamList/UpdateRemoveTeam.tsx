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
import updater from "../../../utilities/updateFetcher";
import deleter from "../../../utilities/deleteFetcher";

interface TeamAdderModalProps {
  userInfo: UserInfo;
  team: Team;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
}

const TeamAdderModal: React.FC<TeamAdderModalProps> = (props) => {
  const token = props.userInfo.token;
  const [modal, setModal] = useState<boolean>(false);
  const [teamTitle, setTeamTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const toggle = () => setModal(!modal);

  const updateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const info: Team = {
        team_name: teamTitle,
        id: props.team.id,
      };
      const teamResults = await updater(token, "teams/updateTeam", info);
      const updatedTeam: Team = teamResults.data.updatedTeam;
      setResponse(teamResults.data.message);
      const sortedTeams = props.teams
        .map((team) => {
          if (team.id === updatedTeam.id) {
            return updatedTeam;
          } else {
            return team;
          }
        })
        .sort((a: Team, b: Team) => {
          if (a.team_name > b.team_name) {
            return 1;
          } else {
            return -1;
          }
        });
      props.setTeams(sortedTeams);
      props.userInfo.teams = sortedTeams;
      props.userInfo.setUserInfo!(props.userInfo);
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } catch (error) {
      console.log(error);
      if (error.response.status < 500 && error.response !== undefined) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not update team. Server error");
      }
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    let confirmation = window.confirm(
      "Are you certain you wish to delete this team?"
    );
    if (confirmation) {
      try {
        setLoading(true);
        const teamResults = await deleter(
          token,
          `teams/removeTeam/${props.team.id}`
        );
        setResponse(teamResults.data.message);
        const filteredTeams = props.teams.filter(
          (team) => team.id !== props.team.id
        );
        props.setTeams(filteredTeams);
        props.userInfo.teams = filteredTeams;
        props.userInfo.setUserInfo!(props.userInfo);
        setTimeout(() => {
          props.setSelectedTeam(
            filteredTeams.length > 0 ? filteredTeams[0] : null
          );
          setResponse("");
          toggle();
        }, 2200);
      } catch (error) {
        console.log(error);
        setResponse(error.message);
        setTimeout(() => {
          setResponse("");
          toggle();
        }, 2200);
      } finally {
        setLoading(false);
      }
    } else {
      setResponse("Deletion Cancelled");
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    }
  };

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <p className={classes.removeClub} onClick={toggle}>
          &#9998;
        </p>
      </Form>
      <Modal isOpen={modal} toggle={toggle} className={classes.modal}>
        <ModalHeader toggle={toggle} className={classes.modalHeader}>
          <header className={classes.headerText}>Update Team Name</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form onSubmit={(e) => updateTeam(e)} className={classes.form}>
            <Label htmlFor="team name">
              <b>
                {props.team
                  ? `Rename Team or Delete ${props.team.team_name}`
                  : ""}
              </b>
            </Label>
            <Input
              required
              type="text"
              name="team name"
              defaultValue={props.team ? props.team.team_name : ""}
              onChange={(e) => setTeamTitle(e.target.value)}
            ></Input>
            <div className={classes.btnGroup}>
              <Button
                className={`${classes.modalBtn} ${classes.updateBtn}`}
                type="submit"
              >
                Update
              </Button>
              <Button
                className={`${classes.modalBtn} ${classes.deleteBtn}`}
                onClick={(e) => deleteTeam(e)}
              >
                Delete
              </Button>
            </div>
            {loading ? <Spinner color="primary" /> : <></>}
            {response ? (
              <Alert className={classes.responseAlert}>{response}</Alert>
            ) : (
              <></>
            )}
            <h6
              className={classes.modalSwitch}
              onClick={(e) => setModalContent(!modalContent)}
            >
              Create a New team
            </h6>
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
