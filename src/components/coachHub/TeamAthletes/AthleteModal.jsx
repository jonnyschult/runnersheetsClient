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
  FormGroup,
  Alert,
  Spinner,
} from "reactstrap";

const StaffModal = (props) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState();
  const [modal, setModal] = useState(false);
  const [expand, setExpand] = useState(false);
  const [feet, setFeet] = useState();
  const [inches, setInches] = useState();
  const [age, setAge] = useState();
  const [weight, setWeight] = useState();

  const toggle = () => setModal(!modal);
  const toggle2 = () => setExpand(!expand);

  /**********************
  UPDATE ATHLETE
  **********************/
  const updateInfo = async (e) => {
    e.preventDefault();
    fetch(`${APIURL}/coach/updateAthlete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        owner: props.athlete.id,
        heightInInches: feet * 12 + inches,
        weightInPounds: weight,
        age,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        setLoading(true);
        await setResponse(data.message);
        props.fetchAthletes(props.selectedTeam.id);
        setLoading(false);
        setTimeout(() => {
          toggle();
          toggle2();
          setResponse("");
        }, 1400);
      })
      .catch(async (err) => {
        setLoading(true);
        await setResponse(err.message);
        setLoading(false);
      });
  };

  /**********************
  DELETE ATHLETE
  **********************/
  const deleteAthlete = (e) => {
    let confirmation = window.confirm(
      "Are you certain you wish to delete this athlete?"
    );
    if (confirmation) {
      fetch(`${APIURL}/coach/removeAthlete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify({
          teamId: props.selectedTeam.id,
          athleteId: props.athlete.id,
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
            props.fetchAthletes(props.selectedTeam.id);
          }, 1200);
        })
        .catch(async (err) => {
          setLoading(true);
          await setResponse(err.message);
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
        <p onClick={toggle}>
          <b>{`${props.athlete.firstName} ${props.athlete.lastName}`}</b>
        </p>
      </Form>
      <Modal
        isOpen={modal}
        toggle={(e) => {
          toggle();
          if (expand) {
            toggle2();
          }
        }}
      >
        <ModalHeader toggle={toggle}>
          <p>{`${props.athlete.firstName} ${props.athlete.lastName}`}</p>
        </ModalHeader>
        <ModalBody>
          <p>{`Email:   ${props.athlete.email}`}</p>
          <p>{`Age:   ${props.athlete.age}`}</p>
          {props.athlete.weightInPounds ? (
            <p>{`Weight:   ${props.athlete.weightInPounds}lbs`}</p>
          ) : (
            <></>
          )}
          {props.athlete.heightInInches ? (
            <p>{`Height:   ${Math.floor(props.athlete.heightInInches / 12)}' ${
              props.athlete.heightInInches % 12
            }"`}</p>
          ) : (
            <></>
          )}
          <h6 onClick={toggle2}>Update?</h6>
          {expand ? (
            <Form onSubmit={(e) => updateInfo(e)}>
              <legend>Athlete Info</legend>
              <FormGroup style={{ display: "flex" }}>
                <span> Height</span>
                <Label htmlFor="feet">Feet</Label>
                <Input
                  type="number"
                  name="feet"
                  placeholder={Math.floor(props.athlete.heightInInches / 12)}
                  onChange={(e) => setFeet(parseInt(e.target.value))}
                ></Input>
                <Label htmlFor="feet">Inches</Label>
                <Input
                  type="number"
                  name="feet"
                  placeholder={props.athlete.heightInInches % 12}
                  onChange={(e) => setInches(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  type="number"
                  name="weight"
                  placeholder={props.athlete.weightInPounds}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="age">Age</Label>
                <Input
                  type="number"
                  name="age"
                  placeholder={props.athlete.age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                ></Input>
              </FormGroup>
              <Button type="submit">Update</Button>
              <Button color="danger" onClick={(e) => deleteAthlete(e)}>
                Delete
              </Button>
              {loading ? <Spinner color="primary" /> : <></>}
              {response ? <Alert>{response}</Alert> : <></>}
            </Form>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
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

export default StaffModal;
