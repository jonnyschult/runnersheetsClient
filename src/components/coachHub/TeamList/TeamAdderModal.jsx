import React, { useState } from "react";
import APIURL from "../../../helpers/environment";
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

const TeamAdderModal = (props) => {
  const [modal, setModal] = useState(false);
  const [teamTitle, setTeamTitle] = useState();
  const [modalContent, setModalContent] = useState(false);
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();

  const toggle = () => setModal(!modal);

  /************************
  ONCLICK CREATE TEAM
  ************************/
  const createTeam = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/team/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        teamName: teamTitle,
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
        console.log(data);
        await props.setSelectedTeam(data.result.newTeam);
        await setLoading(false);
        await props.setUpdate(data);
        setTimeout(() => {
          setResponse(data.message);
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
  ONCLICK UPDATE TEAM
  ************************/
  const updateTeam = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/manager/updateTeam`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        newTeamName: teamTitle,
        teamId: props.selectedTeam.id,
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
        await props.setSelectedTeam(data.updatedTeam);
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
  ONCLICK DELETE TEAM
  ************************/
  const deleteTeam = (e) => {
    e.preventDefault();
    let confirmation = window.confirm(
      "Are you certain you wish to delete this team?"
    );
    if (confirmation) {
      setLoading(true);
      fetch(`${APIURL}/manager/removeTeam`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify({
          teamId: props.selectedTeam.id,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          await props.setSelectedTeam({});
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
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button onClick={toggle} style={{ margin: "0 auto" }}>
          Create or Update Team
        </Button>
      </Form>
      {modalContent ? (
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Update Team Name</ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => updateTeam(e)}>
              <Label htmlFor="team name">
                Rename Team or Delete <b>{props.selectedTeam.teamName}</b>
              </Label>
              <Input
                required
                type="text"
                name="tean name"
                defaultValue={props.selectedTeam.teamName}
                onChange={(e) => setTeamTitle(e.target.value)}
              ></Input>
              <Button color="primary" type="submit">
                Update
              </Button>
              <Button color="danger" onClick={(e) => deleteTeam(e)}>
                Delete
              </Button>
              {loading ? <Spinner color="primary" /> : <></>}
              {response ? <Alert>{response}</Alert> : <></>}
              {err ? <Alert color="danger">{err}</Alert> : <></>}
              <h6 onClick={(e) => setModalContent(!modalContent)}>
                Create a New team?
              </h6>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      ) : (
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            Create a Team and Start Coaching!
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => createTeam(e)}>
              <Label htmlFor="team name">Choose a Team Name</Label>
              <Input
                required
                type="text"
                name="tean name"
                placeholder="e. g. Girls Varsity Cross Country"
                onChange={(e) => setTeamTitle(e.target.value)}
              ></Input>
              <Button color="primary" type="submit">
                Create
              </Button>
              {loading ? <Spinner color="primary" /> : <></>}
              {response ? <Alert>{response}</Alert> : <></>}
              {err ? <Alert color="danger">{err}</Alert> : <></>}
              <h6 onClick={(e) => setModalContent(!modalContent)}>Update?</h6>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default TeamAdderModal;
