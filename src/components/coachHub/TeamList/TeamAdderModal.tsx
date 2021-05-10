import React, { FormEvent, useState } from "react";
import classes from "../Coach.module.css";
import APIURL from "../../../utilities/environment";
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
import { UserInfo, Team, TeamsUsers } from "../../../models";
import poster from "../../../utilities/postFetcher";
import updater from "../../../utilities/updateFetcher";
import deleter from "../../../utilities/deleteFetcher";

interface TeamAdderModalProps {
  userInfo: UserInfo;
  selectedTeam: Team;
  teams: Team[];
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team>>;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamAdderModal: React.FC<TeamAdderModalProps> = (props) => {
  const token = props.userInfo.token;
  const [modal, setModal] = useState<boolean>(false);
  const [teamTitle, setTeamTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<boolean>(false);
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
      setTimeout(() => {
        props.setTeams([...props.teams, newTeam]);
        props.setSelectedTeam(newTeam);
        props.userInfo.setUserInfo!(teamResults.data.updatedUser);
        setResponse("");
        toggle();
      }, 2200);
    } catch (error) {
      console.log(error);
      if (error.status < 500 && error["response"] !== undefined) {
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

  const updateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const info: Team = {
        team_name: teamTitle,
        id: props.selectedTeam.id,
      };
      const teamResults = await updater(token, "teams/updateTeam", info);
      const updatedTeam: Team = teamResults.data.updatedTeam.id;
      setResponse(teamResults.data.message);
      setTimeout(() => {
        props.setTeams(
          props.teams.map((team) => {
            if (team.id === updatedTeam.id) {
              return updatedTeam;
            } else {
              return team;
            }
          })
        );
        props.setSelectedTeam(teamResults.data.updatedTeam);
        setResponse("");
        toggle();
      }, 2200);
    } catch (error) {
      console.log(error);
      if (error.status < 500 && error["response"] !== undefined) {
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
          `teams/removeTeam/${props.selectedTeam.id}`
        );
        setResponse(teamResults.data.message);
        setTimeout(() => {
          props.setTeams(
            props.teams.filter((team) => team.id !== props.selectedTeam.id)
          );
          props.setSelectedTeam(teamResults.data.updatedTeam);
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
        <Button onClick={toggle} className={classes.adderModalButton}>
          +
        </Button>
      </Form>
      {modalContent ? (
        <Modal isOpen={modal} toggle={toggle} className={classes.modal}>
          <ModalHeader toggle={toggle} className={classes.modalHeader}>
            <header className={classes.headerText}>Update Team Name</header>
          </ModalHeader>
          <ModalBody className={classes.modalBody}>
            <Form onSubmit={(e) => updateTeam(e)} className={classes.form}>
              <Label htmlFor="team name">
                Rename Team or Delete <b>{props.selectedTeam.team_name}</b>
              </Label>
              <Input
                required
                type="text"
                name="team name"
                defaultValue={props.selectedTeam.team_name}
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
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      ) : (
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
              {response ? (
                <Alert className={classes.responseAlert}>{response}</Alert>
              ) : (
                <></>
              )}
              <h6
                className={classes.modalSwitch}
                onClick={(e) => setModalContent(!modalContent)}
              >
                Update
              </h6>
            </Form>
          </ModalBody>
          <ModalFooter className={classes.modalFooter}>
            <Button
              className={`${classes.modalBtn} ${classes.cancelBtn}`}
              onClick={toggle}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default TeamAdderModal;
