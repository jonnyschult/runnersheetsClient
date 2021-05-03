import React, { useState } from "react";
import APIURL from "../../../utilities/environment";
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

const ChairModal = (props) => {
  const [response, setResponse] = useState("");
  const [err, setErr] = useState();
  const [loading, setLoading] = useState();
  const [modal, setModal] = useState(false);
  const [expand, setExpand] = useState(false);
  const [role, setRole] = useState();

  const toggle = () => setModal(!modal);
  const toggle2 = () => setExpand(!expand);

  /**********************
  UPDATE CHAIRPERSON ROLE
  **********************/
  const updateInfo = (e) => {
    e.preventDefault();
    fetch(`${APIURL}/chairperson/updateChairperson`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        clubId: props.selectedClub.id,
        userId: props.chairperson.id,
        newRole: role,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        setLoading(true);
        await setResponse(data.message);
        setLoading(false);
        props.fetchChairpersons(props.selectedClub.id);
        setTimeout(() => {
          toggle();
          toggle2();
          setResponse("");
        }, 1200);
      })
      .catch(async (err) => {
        setLoading(true);
        await setErr(err.message);
        setLoading(false);
      });
  };

  /**********************
  DELETE CHAIRPERSON
  **********************/
  const deleteChairperson = (e) => {
    let confirmation = window.confirm(
      "Are you certain you wish to delete this user?"
    );
    if (confirmation) {
      fetch(`${APIURL}/chairperson/removeChairperson`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify({
          clubId: props.selectedClub.id,
          chairpersonId: props.chairperson.id,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          setLoading(true);
          await setResponse(data.message);
          setLoading(false);
          setTimeout(() => {
            toggle();
            toggle2();
            setResponse("");
            props.fetchChairpersons(props.selectedClub.id);
          }, 1200);
        })
        .catch(async (err) => {
          setLoading(true);
          await setErr(err.message);
          setLoading(false);
        });
    } else {
      toggle();
      toggle2();
    }
  };

  return (
    <div>
      <Form inline onSubmit={(e) => updateInfo(e)}>
        <p onClick={toggle} className={classes.cardItem}>
          <b>{`${props.chairperson.firstName} ${props.chairperson.lastName}: `}</b>
          <i> {props.chairperson.role}</i>
        </p>
      </Form>
      <Modal
        className={classes.modal}
        isOpen={modal}
        toggle={(e) => {
          toggle();
          if (expand) {
            toggle2();
          }
        }}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header
            className={classes.headerText}
          >{`${props.chairperson.firstName} ${props.chairperson.lastName}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <p>{`Email:   ${props.chairperson.email}`}</p>
          <p>{`Role:   ${props.chairperson.role}`}</p>
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
                      onChange={(e) => setRole(e.target.value)}
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
                      onChange={(e) => setRole(e.target.value)}
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
              {err ? (
                <Alert className={classes.responseAlert}>{err}</Alert>
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
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ChairModal;
