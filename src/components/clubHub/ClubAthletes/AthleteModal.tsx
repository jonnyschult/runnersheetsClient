import React, { useState } from "react";
import classes from "../Club.module.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Form,
  Alert,
  Spinner,
} from "reactstrap";
import { Club, User, UserInfo } from "../../../models";
import { deleter } from "../../../utilities";

interface AthleteModalProps {
  userInfo: UserInfo;
  athlete: User;
  athletes: User[];
  selectedClub: Club | null;
  setAthletes: React.Dispatch<React.SetStateAction<User[]>>;
}

const StaffModal: React.FC<AthleteModalProps> = (props) => {
  const token = props.userInfo.token;
  const athlete = props.athlete;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>();
  const [modal, setModal] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);

  const toggle = () => setModal(!modal);
  const toggle2 = () => setExpand(!expand);

  const deleteAthlete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let confirmation = window.confirm(
      `Are you certain you wish to delete ${athlete.first_name} from ${props.selectedClub?.club_name}?`
    );
    if (confirmation) {
      try {
        setLoading(true);
        const results = await deleter(
          token,
          "clubs/removeAthlete",
          `club_id=${props.selectedClub!.id}&user_id=${athlete.id}`
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
          setResponse("Could not remove clubmember. Server error");
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
        <p className={classes.cardItem} onClick={toggle}>
          <b>{`${props.athlete.first_name} ${props.athlete.last_name}`}</b>
        </p>
      </Form>
      <Modal
        className={classes.modal}
        isOpen={modal}
        toggle={(e: any) => {
          toggle();
          if (expand) {
            toggle2();
          }
        }}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header
            className={classes.headerText}
          >{`${props.athlete.first_name} ${props.athlete.last_name}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <p>{`Email:   ${props.athlete.email}`}</p>
          <Button
            className={`${classes.modalBtn} ${classes.deleteBtn}`}
            onClick={(e) => deleteAthlete(e)}
          >
            Delete
          </Button>
          {loading ? <Spinner color="primary" /> : <></>}
          {response ? (
            <Alert className={classes.responseAlert}>{response}</Alert>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
            color="primary"
            onClick={(e) => {
              toggle();
              if (expand) {
                toggle2();
              }
            }}
          >
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default StaffModal;
