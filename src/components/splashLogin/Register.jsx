import React, { useState } from "react";
import APIURL from "../../helpers/environment";
import {
  Button,
  Form,
  FormGroup,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Alert,
} from "reactstrap";

const Register = (props) => {
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState();
  // const [heightInInches, setHeightInInches] = useState(null);
  const [feet, setFeet] = useState(null);
  const [inches, setInches] = useState(null);
  const [weightInPounds, setWeightInPounds] = useState(null);
  const [age, setAge] = useState(null);
  const [err, setErr] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();
    let height = 0;
    if (feet && inches) {
      height = feet * 12 + inches;
    }
    if (password === confirmPassword) {
      fetch(`${APIURL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          password,
          heightInInches: height,
          weightInPounds,
          age,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 406) {
            throw new Error("Password must be atleat 8 characters long");
          } else if (res.status === 409) {
            throw new Error("Account with that email already exists");
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then((data) => {
          props.updateToken(data.loginToken);
        })
        .catch((err) => {
          setErr(err.message);
        });
    }
  };
  return (
    <>
      <ModalHeader>Register to Create Teams and Build Plans</ModalHeader>
      <ModalBody>
        <p>* Indicates optional field</p>
        <Form onSubmit={(e) => submitHandler(e)}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              required
              type="email"
              name="email"
              placeholder="your@email.here"
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Create a password</Label>
            <Input
              required
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </FormGroup>
          {password.length < 8 && password.length > 1 ? (
            <Alert>Password must be atleast 8 characters</Alert>
          ) : (
            <></>
          )}
          <FormGroup>
            <Label htmlFor="Confirm Password">Confirm password</Label>
            <Input
              required
              type="password"
              name="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Input>
          </FormGroup>
          {password !== confirmPassword && password.length > 0 ? (
            <Alert>Passwords must match</Alert>
          ) : (
            <></>
          )}
          <FormGroup>
            <Label htmlFor="first name">First Name</Label>
            <Input
              required
              type="text"
              name="first name"
              onChange={(e) => setFirstName(e.target.value)}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="last name">Last Name</Label>
            <Input
              required
              type="text"
              name="last name"
              onChange={(e) => setLastName(e.target.value)}
            ></Input>
          </FormGroup>
          <FormGroup style={{ display: "flex" }}>
            <span> Height*</span>
            <Label htmlFor="feet">Feet</Label>
            <Input
              type="number"
              name="feet"
              onChange={(e) => setFeet(parseInt(e.target.value))}
            ></Input>
            <Label htmlFor="feet">Inches</Label>
            <Input
              type="number"
              name="feet"
              onChange={(e) => setInches(parseInt(e.target.value))}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="weight">Weight*</Label>
            <Input
              type="number"
              name="weight"
              onChange={(e) => setWeightInPounds(parseInt(e.target.value))}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="age">Age*</Label>
            <Input
              type="number"
              name="age"
              onChange={(e) => setAge(parseInt(e.target.value))}
            ></Input>
          </FormGroup>
          <Button type="submit" style={{ width: "100%" }}>
            Submit
          </Button>

          {err ? <Alert>{err}</Alert> : <></>}
        </Form>
      </ModalBody>
      <ModalFooter>
        Already a user? <h6 onClick={props.registerToggle}>Login</h6>
      </ModalFooter>
    </>
  );
};

export default Register;
