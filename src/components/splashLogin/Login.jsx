import React, { useState } from "react";
import APIURL from "../../helpers/environment";
import classes from "./Modal.module.css";
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
  Spinner,
} from "reactstrap";

const Login = (props) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {
        setErr(err.message);
        setLoading(false);
      });
  };
  return (
    <>
      <ModalHeader className={classes.modalHeader}>Login</ModalHeader>
      <ModalBody className={classes.modalBody}>
        <Form onSubmit={(e) => submitHandler(e)}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              className={classes.input}
              required
              type="email"
              name="email"
              placeholder="your@email.here"
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              className={classes.input}
              required
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </FormGroup>
          <Button type="submit" className={classes.submitButton}>
            Submit
          </Button>
          {loading ? <Spinner></Spinner> : <></>}
          {err ? <Alert>{err}</Alert> : <></>}
        </Form>
      </ModalBody>
      <ModalFooter className={classes.modalFooter}>
        <p className={classes.switchModalText}>Don't have an account?</p>
        <span className={classes.switchModal} onClick={props.registerToggle}>
          Sign Up
        </span>
      </ModalFooter>
    </>
  );
};

export default Login;
