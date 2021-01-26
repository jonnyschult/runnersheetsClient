import React, { useState } from "react";
import APIURL from "../../../helpers/environment";
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

const AthleteUpdater = (props) => {
  const [err, setErr] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [clubTitle, setClubTitle] = useState();

  const toggle = () => setModal(!modal);

  /************************
  UPDATE CLUB
  ************************/
  const updateClub = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/chairperson/updateClub`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        newClubName: clubTitle,
        clubId: props.club.id,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 409) {
            throw new Error("Name Already Taken");
          } else {
            throw new Error("Something went wrong");
          }
        }
      })
      .then(async (data) => {
        await props.setSelectedClub(data.updatedClub);
        await props.setUpdate(data);
        setLoading(false);
        setResponse(data.message);
        setTimeout(() => {
          setResponse("");
          toggle();
        }, 1400);
      })
      .catch(async (err) => {
        setLoading(false);
        setErr(err.message);
        setTimeout(() => {
          setErr("");
        }, 4000);
      });
  };

  /************************
ONCLICK DELETE CLUB
************************/
  const deleteClub = (e) => {
    e.preventDefault();
    let confirmation = window.confirm(
      "Are you certain you wish to delete this club?"
    );
    if (confirmation) {
      setLoading(true);
      fetch(`${APIURL}/chairperson/removeClub`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify({
          clubId: props.club.id,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          await props.setSelectedClub({});
          await props.setUpdate(data);
          await setResponse(data.message);
          setLoading(false);
          setTimeout(() => {
            setResponse("");
            toggle();
          }, 1200);
        })
        .catch(async (err) => {
          setLoading(false);
          setErr(err.message);
          setTimeout(() => {
            setErr("");
            toggle();
          }, 4000);
        });
    } else {
      toggle();
    }
  };

  return (
    <div>
      <p className={classes.removeClub} onClick={toggle}>
        -
      </p>
      <Modal isOpen={modal} toggle={toggle} className={classes.removeClubModal}>
        <ModalHeader toggle={toggle} className={classes.modalHeader}>
          <header className={classes.headerText}>Update Club Name</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form onSubmit={(e) => updateClub(e)} className={classes.form}>
            <Label htmlFor="club name">
              Rename or Delete Club <b>{props.club.clubName}</b>
            </Label>
            <Input
              required
              type="text"
              name="club name"
              defaultValue={props.club.clubName}
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
            {err ? <Alert className={classes.errAlert}>{err}</Alert> : <></>}
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

export default AthleteUpdater;
