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

interface StaffAdderModalProps {
  staff: User[];
  setStaff: React.Dispatch<React.SetStateAction<User[]>>;
  selectedTeam: Team | null;
  userInfo: UserInfo;
}

const StaffAdderModal: React.FC<StaffAdderModalProps> = (props) => {
  const token = props.userInfo.token;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const toggle = () => setModal(!modal);

  const addCoach = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const info = {
        team_id: +props.selectedTeam!.id!,
        email,
        role,
      };
      const results = await poster(token, "teams/addCoach", info);
      const teamMember: User = results.data.teamMember;
      teamMember.role = role;
      setResponse(results.data.message);
      setTimeout(() => {
        props.setStaff(
          [...props.staff, teamMember].sort((a: User, b: User) => {
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
      <Form onSubmit={(e) => e.preventDefault()}>
        <button onClick={toggle} className={classes.adderModalButton}>
          +
        </button>
      </Form>
      <Modal className={classes.modal} isOpen={modal} toggle={toggle}>
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>
            {props.selectedTeam === null
              ? "Select a team first"
              : `Add Coach to ${props.selectedTeam.team_name}`}
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => addCoach(e)}>
            <FormGroup>
              <legend>New Coach's Email</legend>
              <Label htmlFor="email">
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="newCoach@email.here"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup tag="fieldset">
              <legend>New Coaches Role</legend>
              <FormGroup check>
                <Label check>
                  <Input
                    required
                    type="radio"
                    name="radio1"
                    value="coach"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Coach
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    required
                    type="radio"
                    name="radio1"
                    value="manager"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Manager
                </Label>
              </FormGroup>
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
        <ModalFooter>
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

export default StaffAdderModal;
