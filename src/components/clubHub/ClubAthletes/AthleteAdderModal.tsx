import React, { useState } from "react";
import classes from "../Club.module.css";
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
import { Club, User, UserInfo } from "../../../models";
import { poster } from "../../../utilities";

interface AthleteAdderModalProps {
  userInfo: UserInfo;
  athletes: User[];
  setAthletes: React.Dispatch<React.SetStateAction<User[]>>;
  selectedClub: Club | null;
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
        club_id: +props.selectedClub!.id!,
        email,
      };
      const results = await poster(token, "clubs/addAthlete", info);
      const clubMember: User = results.data.clubMember;
      setResponse(results.data.message);
      props.setAthletes(
        [...props.athletes, clubMember].sort((a: User, b: User) => {
          if (a.last_name > b.last_name) {
            return 1;
          } else {
            return -1;
          }
        })
      );
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not add athlete. Server error");
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
          <header className={classes.headerText}>Add Athlete to Club</header>
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
              disabled={props.selectedClub === null ? true : false}
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
