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
  FormGroup,
  Alert,
  Spinner,
} from "reactstrap";
import { Team, User, UserInfo } from "../../../models";
import poster from "../../../utilities/postFetcher";

interface AthleteAdderModalProps {
  userInfo: UserInfo;
  athletes: User[];
  selectedTeam: Team | null;
  setAthletes: React.Dispatch<React.SetStateAction<User[]>>;
}

const AthleteAdderModal: React.FC<AthleteAdderModalProps> = (props) => {
  const token = props.userInfo.token;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const toggle = () => setModal(!modal);

  const addAthlete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const info = {
        team_id: +props.selectedTeam!.id!,
        email,
      };
      const results = await poster(token, "teams/addAthlete", info);
      const teamMember: User = results.data.teamMember;
      setResponse(results.data.message);
      setTimeout(() => {
        props.setAthletes(
          [...props.athletes, teamMember].sort((a: User, b: User) => {
            if (a.last_name > b.last_name) {
              return 1;
            } else {
              return -1;
            }
          })
        );
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
      <Modal className={classes.modal} isOpen={modal} toggle={toggle}>
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>
            {props.selectedTeam === null
              ? "Select a team first"
              : `Add Athlete to ${props.selectedTeam.team_name}`}
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => addAthlete(e)}>
            <FormGroup>
              <legend>Athlete's Email</legend>
              <Label htmlFor="email">
                <Input
                  className={classes.plusAthleteEmail}
                  required
                  type="email"
                  name="email"
                  placeholder="newAthlete@email.here"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>
            </FormGroup>

            <Button
              className={`${classes.modalBtn} ${classes.addBtn}`}
              type="submit"
              disabled={props.selectedTeam === null ? true : false}
            >
              Add
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

export default AthleteAdderModal;
