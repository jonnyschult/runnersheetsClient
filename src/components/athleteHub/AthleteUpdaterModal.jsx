import React, { useState } from "react";
import APIURL from "../../helpers/environment";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";

const AthleteUpdater = (props) => {
  const [feet, setFeet] = useState(
    Math.floor(props.athlete.heightInInches / 12)
  );
  const [inches, setInches] = useState(props.athlete.heightInInches % 12);
  const [weight, setWeight] = useState(props.athlete.weight);
  const [age, setAge] = useState(props.athlete.age);
  const [err, setErr] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const updateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    let height = 0;
    if (feet && inches) {
      height = feet * 12 + inches;
    }
    fetch(`${APIURL}/user/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        heightInInches: height,
        weightInPounds: weight,
        age,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {
          throw new Error("No User Found");
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(async (data) => {
        await props.setUpdate(data);
        await setResponse(data.message);
        setLoading(false);
        setTimeout(() => {
          toggle();
          setResponse("");
        }, 1200);
      })
      .catch((err) => {
        setErr(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault}>
        <h6 onClick={toggle}>Update Metrics?</h6>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName="sheetModal"
        className="print"
      >
        <ModalHeader>Update Athlete Metrics</ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => updateInfo(e)}>
            <FormGroup style={{ display: "flex" }}>
              <span> Height</span>
              <Label htmlFor="feet">Feet</Label>
              <Input
                type="number"
                name="feet"
                defaultValue={Math.floor(props.athlete.heightInInches / 12)}
                onChange={(e) => setFeet(parseInt(e.target.value))}
              ></Input>
              <Label htmlFor="inches">Inches</Label>
              <Input
                type="number"
                name="inches"
                defaultValue={Math.floor(props.athlete.heightInInches % 12)}
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
            <Button type="submit" style={{ width: "100%" }}>
              Submit
            </Button>
            {response ? <Alert>{response}</Alert> : <></>}
            {err ? <Alert color="danger">{err}</Alert> : <></>}
            {loading ? <Spinner></Spinner> : <></>}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle} className="modalButton">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AthleteUpdater;
