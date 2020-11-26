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
  const [password, setPassword] = useState(null);
  const [err, setErr] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    fetch(`${APIURL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 403) {
            throw new Error("Wrong password");
          } else if (res.status === 404) {
            throw new Error("No account associated with that email");
          } else {
            throw new Error("Something went wrong");
          }
        }
      })
      .then(async (data) => {
        await props.updateIsCoach(data.user.isCoach);
        await props.updateToken(data.loginToken);
      })
      .catch((err) => {
        setErr(err.message);
      });
  };
  return (
    <>
      <ModalHeader>Register to Create Teams and Build Plans</ModalHeader>
      <ModalBody style={{ display: "flex", flexDirection: "column" }}>
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
          <Button type="submit" style={{ width: "100%" }}>
            Submit
          </Button>
          {err ? <Alert>{err}</Alert> : <></>}
        </Form>
      </ModalBody>
      <ModalFooter>
        Don't have an account? <h6 onClick={props.registerToggle}>Sign Up</h6>
      </ModalFooter>
    </>
  );
};

export default Register;
