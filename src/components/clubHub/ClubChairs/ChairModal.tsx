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
import { Club, ClubsUsers, User, UserInfo } from "../../../models";
import { deleter, updater } from "../../../utilities";

interface ChairModalProps {
  userInfo: UserInfo;
  chairperson: User;
  clubs: Club[];
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
  setChairpersons: React.Dispatch<React.SetStateAction<User[]>>;
  setSelectedClub: React.Dispatch<React.SetStateAction<Club | null>>;
  chairpersons: User[];
  selectedClub: Club | null;
}

const ChairModal: React.FC<ChairModalProps> = (props) => {
  const token = props.userInfo.token;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");

  const toggle = () => setModal(!modal);
  const toggle2 = () => setExpand(!expand);

  const updateInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const info: ClubsUsers = {
        club_id: props.selectedClub!.id!,
        user_id: props.chairperson.id!,
        role: role,
      };
      const results = await updater(token, "clubs/updateChairperson", info);
      props.chairperson.role = results.data.updatedClubsUsersItem.role;
      setResponse(results.data.message);
      props.setChairpersons(
        props.chairpersons.map((person: User) => {
          if (person.id === props.chairperson.id) {
            return props.chairperson;
          } else {
            return person;
          }
        })
      );
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } catch (error) {
      console.log(error, error.response);
      if (error.response.status < 500 && error.response !== undefined) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not update role. Server error");
      }
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  const deleteChairperson = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let confirmation = window.confirm(
      `Are you certain you wish to delete ${
        props.chairperson.first_name
      } from ${props.selectedClub!.club_name}?`
    );
    if (confirmation) {
      try {
        setLoading(true);
        const results = await deleter(
          token,
          "clubs/removeChairperson",
          `club_id=${props.selectedClub!.id}&user_id=${props.chairperson.id}`
        );
        setResponse(results.data.message);
        setTimeout(() => {
          //removes club if user deleted themself
          props.setChairpersons(
            props.chairpersons.filter(
              (person: User) => person.id !== props.chairperson.id
            )
          );
          if (props.chairperson.id === props.userInfo.user.id) {
            const filteredClubs = props.clubs.filter(
              (club) => club.id !== props.selectedClub!.id
            );
            props.setClubs(filteredClubs);
            props.userInfo.clubs = filteredClubs;
            props.userInfo.setUserInfo!(props.userInfo);
            props.setSelectedClub(
              filteredClubs.length > 0 ? filteredClubs[0] : null
            );
          }
          setResponse("");
          toggle();
        }, 2200);
      } catch (error) {
        console.log(error);
        if (error.response.status < 500 && error.response !== undefined) {
          setResponse(error.response.data.message);
        } else {
          setResponse("Could not delete user. Server error");
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
      <Form inline onSubmit={(e) => updateInfo(e)}>
        <p onClick={toggle} className={classes.cardItem}>
          <b>{`${props.chairperson.first_name} ${props.chairperson.last_name}: `}</b>
          <i> {props.chairperson.role === "chair" ? "Chair" : "Vice Chair"}</i>
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
          >{`${props.chairperson.first_name} ${props.chairperson.last_name}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <p>{`Email:   ${props.chairperson.email}`}</p>
          <p>{`Role:   ${
            props.chairperson.role === "chair" ? "Chair" : "Vice Chair"
          }`}</p>
          <h6 className={classes.modalExpand} onClick={toggle2}>
            Update
          </h6>
          {expand ? (
            <Form className={classes.form} onSubmit={(e) => updateInfo(e)}>
              <FormGroup tag="fieldset">
                <legend>New Role</legend>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="radio1"
                      value="vice chairperson"
                      onChange={(e) => setRole("vice_chair")}
                    />
                    Vice Chairperson
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="radio1"
                      value="chairperson"
                      onChange={(e) => setRole("chair")}
                    />
                    Chairperson
                  </Label>
                </FormGroup>
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
                  onClick={(e) => deleteChairperson(e)}
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
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
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

export default ChairModal;
