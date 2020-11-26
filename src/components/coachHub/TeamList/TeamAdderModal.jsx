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
  // const [response, setResponse] = useState("");
  // const [loading, setLoading] = useState();
  const [modal, setModal] = useState(false);
  const [teamTitle, setTeamTitle] = useState();
  const [update, setUpdate] = useState(false);

  const toggle = () => setModal(!modal);

  /************************
  ONCLICK CREATE TEAM
  ************************/
  const createTeam = (e) => {
    e.preventDefault();
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
        props.setLoading(true);
        await props.setResponse(data.message);
        props.setLoading(false);
        setTimeout(() => {
          toggle();
          props.setResponse("");
        }, 1400);
      })
      .catch(async (err) => {
        props.setLoading(true);
        await props.setResponse(err.message);
        props.setLoading(false);
        setTimeout(() => {
          props.setResponse("");
        }, 4000);
      });
  };

  /************************
  ONCLICK UPDATE TEAM
  ************************/
  const updateTeam = (e) => {
    e.preventDefault();
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
        props.setLoading(true);
        await props.setResponse(data.message);
        props.setLoading(false);
        setTimeout(() => {
          toggle();
          props.setResponse("");
        }, 1400);
      })
      .catch(async (err) => {
        props.setLoading(true);
        await props.setResponse(err.message);
        props.setLoading(false);
        setTimeout(() => {
          props.setResponse("");
        }, 4000);
      });
  };

  /************************
  ONCLICK DELETE TEAM
  ************************/
  const deleteTeam = (e) => {
    let confirmation = window.confirm(
      "Are you certain you wish to delete this team?"
    );
    if (confirmation) {
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
          props.setLoading(true);
          await props.setResponse(data.message);
          props.setLoading(false);
          setTimeout(() => {
            toggle();
            props.setResponse("");
          }, 1200);
        })
        .catch(async (err) => {
          props.setLoading(true);
          await props.setResponse(err.message);
          props.setLoading(false);
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
      {update ? (
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Update Team Name</ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => updateTeam(e)}>
              <Label htmlFor="team name">Rename Team</Label>
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
              <Button color="danger" onClick={(e) => deleteTeam()}>
                Delete
              </Button>
              {props.loading ? <Spinner color="primary" /> : <></>}
              {props.response ? (
                <Alert style={{ backgroundColor: " rgb(255, 155, 0)" }}>
                  {props.response}
                </Alert>
              ) : (
                <></>
              )}
              <h6 onClick={(e) => setUpdate(!update)}>Create a New team?</h6>
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
              {props.loading ? <Spinner color="primary" /> : <></>}
              {props.response ? (
                <Alert style={{ backgroundColor: " rgb(255, 155, 0)" }}>
                  {props.response}
                </Alert>
              ) : (
                <></>
              )}
              <h6 onClick={(e) => setUpdate(!update)}>Update?</h6>
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
