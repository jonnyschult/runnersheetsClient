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
  Alert,
  Spinner,
} from "reactstrap";
import { Club, UserInfo } from "../../../models";
import { poster } from "../../../utilities";

interface ClubAdderModalProps {
  clubs: Club[];
  userInfo: UserInfo;
  selectedClub: Club | null;
  setSelectedClub: React.Dispatch<React.SetStateAction<Club | null>>;
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
}

const ClubAdderModal: React.FC<ClubAdderModalProps> = (props) => {
  const token = props.userInfo.token;
  const [modal, setModal] = useState<boolean>(false);
  const [clubTitle, setClubTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const toggle = () => setModal(!modal);

  const createClub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const info: Club = {
        club_name: clubTitle,
      };
      const clubResults = await poster(token, "clubs/create", info);
      const newClub: Club = clubResults.data.newClub;
      setResponse(clubResults.data.message);
      const sortedClubs = [...props.clubs, newClub].sort((a: Club, b: Club) => {
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
        props.setSelectedClub(newClub);
        props.userInfo.setUserInfo!(clubResults.data.updatedUser);
        setResponse("");
        toggle();
      }, 2200);
    } catch (error) {
      console.log(error);
      if (error.status < 500 && error["response"] !== undefined) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not create Club Club. Server error");
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
          <header className={classes.headerText}>Create a Club!</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form onSubmit={(e) => createClub(e)}>
            <Label htmlFor="club name">Choose a Club Name</Label>
            <Input
              required
              type="text"
              name="club name"
              placeholder="Chicago Ultra Runners"
              onChange={(e) => setClubTitle(e.target.value)}
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
    </div>
  );
};

export default ClubAdderModal;
