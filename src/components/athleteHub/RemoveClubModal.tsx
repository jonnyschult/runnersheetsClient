import React, { useState } from "react";
import classes from "./Athlete.module.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Spinner,
} from "reactstrap";
import { Club, UserInfo } from "../../models";
import { deleter } from "../../utilities";

interface RemoveClubModalProps {
  userInfo: UserInfo;
  club: Club;
  clubs: Club[];
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
}

const RemoveClubmodal: React.FC<RemoveClubModalProps> = (props) => {
  const token = props.userInfo.token;
  const [response, setResponse] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const toggle = () => setModal(!modal);

  const removeSelf = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    let confirmation = window.confirm(
      "Are you certain you wish to delete this club?"
    );
    if (confirmation) {
      try {
        setLoading(true);
        const clubResults = await deleter(
          token,
          `clubs/removeSelf/${props.club.id}`
        );
        setResponse(clubResults.data.message);
        const filteredClubs = props.clubs.filter(
          (club) => club.id !== props.club.id
        );
        setTimeout(() => {
          props.setClubs(filteredClubs);
          props.userInfo.clubs = filteredClubs;
          props.userInfo.setUserInfo!(props.userInfo);
          setResponse("");
          toggle();
        }, 2200);
      } catch (error) {
        console.log(error);
        if (error.response.status === 403) {
          setResponse(
            "You cannot remove yourself from a club where you are the only chair person. Got to clubs and delete the club."
          );
        } else {
          setResponse("There was an error");
        }
        setTimeout(() => {
          setResponse("");
          toggle();
        }, 3000);
      } finally {
        setLoading(false);
      }
    } else {
      setResponse("Deletion Cancelled");
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 30000);
    }
  };

  return (
    <>
      <p className={classes.removeClub} onClick={toggle}>
        -
      </p>
      <Modal isOpen={modal} toggle={toggle} className={classes.removeClubModal}>
        <ModalHeader className={classes.modalHeader}>
          <header className={classes.headerText}>Remove Club</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <h5>{`Are you sure you want to remove yourself from ${props.club.club_name}?`}</h5>
          <Button
            className={`${classes.modalBtn} ${classes.deleteBtn}`}
            onClick={(e) => removeSelf(e)}
          >
            Remove
          </Button>
          {response ? (
            <Alert className={classes.responseAlert}>{response}</Alert>
          ) : (
            <></>
          )}
          {loading ? <Spinner></Spinner> : <></>}
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
    </>
  );
};

export default RemoveClubmodal;
