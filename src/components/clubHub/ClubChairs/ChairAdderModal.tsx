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

interface ChairAdderModalProps {
  userInfo: UserInfo;
  chairpersons: User[];
  setChairpersons: React.Dispatch<React.SetStateAction<User[]>>;
  selectedClub: Club | null;
}

const ChairAdderModal: React.FC<ChairAdderModalProps> = (props) => {
  const token = props.userInfo.token;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const toggle = () => setModal(!modal);

  const addChair = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const info = {
        club_id: +props.selectedClub!.id!,
        email,
        role,
      };
      const results = await poster(token, "clubs/addChair", info);
      const clubMember: User = results.data.clubMember;
      clubMember.role = role;
      setResponse(results.data.message);
      setTimeout(() => {
        props.setChairpersons(
          [...props.chairpersons, clubMember].sort((a: User, b: User) => {
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
            {props.selectedClub === null
              ? "Select a club first"
              : `Add Coach to ${props.selectedClub.club_name}`}
          </header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => addChair(e)}>
            <FormGroup>
              <legend>New Chairperson's Email</legend>
              <Label htmlFor="email">
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="newChair@email.here"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup tag="fieldset">
              <legend>New Chairpersons Role</legend>
              <FormGroup check>
                <Label check>
                  <Input
                    required
                    type="radio"
                    name="radio1"
                    value="vice chairperson"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Vice Chair
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    required
                    type="radio"
                    name="radio1"
                    value="chairperson"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Chairperson
                </Label>
              </FormGroup>
            </FormGroup>
            <Button
              className={`${classes.modalBtn} ${classes.addBtn}`}
              type="submit"
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
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ChairAdderModal;
