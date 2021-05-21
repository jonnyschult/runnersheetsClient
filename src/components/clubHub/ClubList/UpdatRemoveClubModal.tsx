import React, { useState } from "react";
import classes from "../Club.module.css";
import {
  Form,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Spinner,
} from "reactstrap";
import { Club, UserInfo } from "../../../models";
import { deleter, updater } from "../../../utilities";

interface UpdateRemoveClubProps {
  club: Club;
  clubs: Club[];
  userInfo: UserInfo;
  setSelectedClub: React.Dispatch<React.SetStateAction<Club | null>>;
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
}

const UpdateRemoveClubModal: React.FC<UpdateRemoveClubProps> = (props) => {
  const token = props.userInfo.token;
  const [response, setResponse] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [clubTitle, setClubTitle] = useState<string>("");

  const toggle = () => setModal(!modal);

  const updateClub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const info: Club = {
        club_name: clubTitle,
        id: props.club.id,
      };
      const clubResults = await updater(token, "clubs/updateClub", info);
      const updatedClub: Club = clubResults.data.updatedClub;
      setResponse(clubResults.data.message);
      const sortedClubs = props.clubs
        .map((club) => {
          if (club.id === updatedClub.id) {
            return updatedClub;
          } else {
            return club;
          }
        })
        .sort((a: Club, b: Club) => {
          if (a.club_name > b.club_name) {
            return 1;
          } else {
            return -1;
          }
        });
      props.setClubs(sortedClubs);
      props.userInfo.clubs = sortedClubs;
      props.userInfo.setUserInfo!(props.userInfo);
      setTimeout(() => {
        props.setSelectedClub(clubResults.data.updatedClub);
        setResponse("");
        toggle();
      }, 2200);
    } catch (error) {
      console.log(error);
      if (error.response.status < 500 && error.response !== undefined) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not update club. Server error");
      }
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  const deleteClub = async (
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
          "clubs/removeClub",
          `id=${props.club.id}`
        );
        setResponse(clubResults.data.message);
        const filteredClubs = props.clubs.filter(
          (club) => club.id !== props.club.id
        );
        setTimeout(() => {
          props.userInfo.clubs = filteredClubs;
          props.userInfo.setUserInfo!(props.userInfo);
          props.setClubs(filteredClubs);
          props.setSelectedClub(
            filteredClubs.length > 0 ? filteredClubs[0] : null
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
      <p className={classes.removeClub} onClick={toggle}>
        &#9998;
      </p>
      <Modal isOpen={modal} toggle={toggle} className={classes.removeClubModal}>
        <ModalHeader toggle={toggle} className={classes.modalHeader}>
          <header className={classes.headerText}>Update Club Name</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form onSubmit={(e) => updateClub(e)} className={classes.form}>
            <Label htmlFor="club name">
              Rename or Delete Club <b>{props.club.club_name}</b>
            </Label>
            <Input
              required
              type="text"
              name="club name"
              defaultValue={props.club.club_name}
              onChange={(e) => setClubTitle(e.target.value)}
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
                onClick={(e) => deleteClub(e)}
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
            onClick={toggle}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UpdateRemoveClubModal;
