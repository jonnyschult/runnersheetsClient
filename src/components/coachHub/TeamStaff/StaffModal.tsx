import React, { useState } from "react";
import APIURL from "../../../utilities/environment";
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
import { Team, TeamsUsers, User, UserInfo } from "../../../models";
import updater from "../../../utilities/updateFetcher";
import deleter from "../../../utilities/deleteFetcher";

interface StaffModalProps {
  staffer: User;
  staff: User[];
  selectedTeam: Team;
  userInfo: UserInfo;
  setStaff: React.Dispatch<React.SetStateAction<User[]>>;
}

const StaffModal: React.FC<StaffModalProps> = (props) => {
  const token = props.userInfo.token;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>();
  const [modal, setModal] = useState<boolean>(false);
  const [updateOpen, setOpenUpdate] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");

  const toggle = () => setModal(!modal);
  const updateFormOpener = () => setOpenUpdate(!updateOpen);

  const updateInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const info: TeamsUsers = {
        team_id: props.selectedTeam.id!,
        user_id: props.staffer.id!,
        role: role,
      };
      const results = await updater(token, "teams/updateCoach", info);
      props.staffer.role = results.data.updatedTeamsUsersItem.role;
      setResponse(results.data.message);
      setTimeout(() => {
        props.setStaff(
          props.staff.map((person: User) => {
            if (person.id === props.staffer.id) {
              return props.staffer;
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
      if (error.status < 500 && error["response"] !== undefined) {
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

  const deleteStaffer = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let confirmation = window.confirm(
      `Are you certain you wish to delete ${props.staffer.first_name} from ${props.selectedTeam.team_name}?`
    );
    if (confirmation) {
      try {
        setLoading(true);
        const results = await deleter(
          token,
          "teams/removeCoach",
          `team_id=${props.selectedTeam.id}&user_id=${props.staffer.id}`
        );
        setResponse(results.data.message);
        setTimeout(() => {
          props.setStaff(
            props.staff.filter((person: User) => person.id !== props.staffer.id)
          );
          setResponse("");
          toggle();
        }, 2200);
      } catch (error) {
        console.log(error);
        if (error.status < 500 && error["response"] !== undefined) {
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
      <Form inline>
        <p onClick={toggle} className={classes.cardItem}>
          <b>{`${props.staffer.first_name} ${props.staffer.last_name}: `}</b>
          <i> {props.staffer.role}</i>
        </p>
      </Form>
      <Modal
        className={classes.modal}
        isOpen={modal}
        toggle={(e: any) => {
          toggle();
          if (updateOpen) {
            updateFormOpener();
          }
        }}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header
            className={classes.headerText}
          >{`${props.staffer.first_name} ${props.staffer.last_name}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <p>{`Email:   ${props.staffer.email}`}</p>
          <p>{`Role:   ${props.staffer.role}`}</p>
          <h6 className={classes.modalExpand} onClick={updateFormOpener}>
            Update
          </h6>
          {updateOpen ? (
            <Form className={classes.form} onSubmit={(e) => updateInfo(e)}>
              <FormGroup tag="fieldset">
                <legend>New Coaches Role</legend>
                <FormGroup check>
                  <Label check>
                    <Input
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
                      type="radio"
                      name="radio1"
                      value="manager"
                      onChange={(e) => setRole(e.target.value)}
                    />
                    Manager
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
                  onClick={(e) => deleteStaffer(e)}
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
              if (updateOpen) {
                updateFormOpener();
              }
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default StaffModal;
