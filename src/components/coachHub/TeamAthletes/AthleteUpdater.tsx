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
import updater from "../../../utilities/updateFetcher";
import deleter from "../../../utilities/deleteFetcher";

interface AthleteModalProps {
  userInfo: UserInfo;
  athlete: User;
  athletes: User[];
  selectedTeam: Team | null;
  setAthletes: React.Dispatch<React.SetStateAction<User[]>>;
}

const AthleteModal: React.FC<AthleteModalProps> = (props) => {
  const athlete = props.athlete;
  const token = props.userInfo.token;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>();
  const [modal, setModal] = useState<boolean>(false);
  const [feet, setFeet] = useState<number | undefined>(
    athlete.height_inches ? Math.floor(athlete.height_inches / 12) : undefined
  );
  const [inches, setInches] = useState<number | undefined>(
    athlete.height_inches ? athlete.height_inches % 12 : undefined
  );
  const [date_of_birth, setDOB] = useState<string>(athlete.date_of_birth);
  const [weight, setWeight] = useState<number | undefined>(
    athlete.weight_pounds
  );

  const toggle = () => setModal(!modal);

  const updateInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const height_inches =
      feet && inches ? feet * 12 + inches : athlete.height_inches;

    try {
      setLoading(true);
      const info: User = {
        first_name: athlete.first_name,
        last_name: athlete.last_name,
        email: athlete.email,
        coach: athlete.coach,
        premium_user: athlete.premium_user,
        height_inches: height_inches,
        weight_pounds: weight,
        date_of_birth,
      };
      const results = await updater(token, "teams/updateAthlete", info);
      const updatedAthlete = results.data.updatedAthlete;
      setResponse(results.data.message);
      setTimeout(() => {
        props.setAthletes(
          props.athletes.map((person: User) => {
            if (person.id === updatedAthlete.id) {
              return updatedAthlete;
            } else {
              return person;
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
        setResponse("Could not update user. Server error");
      }
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  const deleteAthlete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let confirmation = window.confirm(
      `Are you certain you wish to delete ${athlete.first_name} from ${props.selectedTeam?.team_name}?`
    );
    if (confirmation) {
      try {
        setLoading(true);
        const results = await deleter(
          token,
          "teams/removeAthlete",
          `team_id=${props.selectedTeam!.id}&athlete_id=${athlete.id}`
        );
        setResponse(results.data.message);
        setTimeout(() => {
          props.setAthletes(
            props.athletes.filter((person: User) => person.id !== athlete.id)
          );
          setResponse("");
          toggle();
        }, 2200);
      } catch (error) {
        console.log(error);
        if (error.response !== undefined && error.response.status < 500) {
          setResponse(error.response.data.message);
        } else {
          setResponse("Could not update user. Server error");
        }
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
      <Form>
        <p className={classes.editModalIcon} onClick={toggle}>
          &#9998;
        </p>
      </Form>
      <Modal className={classes.modal} isOpen={modal} toggle={toggle}>
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header
            className={classes.headerText}
          >{`Update ${athlete.first_name}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form onSubmit={(e) => updateInfo(e)} className={classes.form}>
            <legend>Athlete Info</legend>
            <FormGroup style={{ display: "flex" }}>
              <span> Height</span>
              <Label htmlFor="feet">Feet</Label>
              <Input
                type="number"
                name="feet"
                placeholder={`${feet}`}
                onChange={(e) => setFeet(parseInt(e.target.value))}
              ></Input>
              <Label htmlFor="feet">Inches</Label>
              <Input
                type="number"
                name="feet"
                placeholder={`${inches}`}
                onChange={(e) => setInches(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="weight">Weight</Label>
              <Input
                type="number"
                name="weight"
                placeholder={`${athlete.weight_pounds}`}
                onChange={(e) => setWeight(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="date_of_birth">date_of_birth*</Label>
              <Input
                type="number"
                name="date_of_birth"
                placeholder={athlete.date_of_birth}
                onChange={(e) => setDOB(e.target.value)}
              ></Input>
            </FormGroup>
            <div className={classes.btnGroup}>
              <Button
                className={`${classes.modalBtn} ${classes.updateBtn}`}
                type="submit"
              >
                Update
              </Button>
              <Button
                className={`${classes.modalBtn} ${classes.deleteBtn}`}
                onClick={(e) => deleteAthlete(e)}
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
          </Form>
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
            color="primary"
            onClick={toggle}
          >
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AthleteModal;
