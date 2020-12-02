import React, { useState } from "react";
import APIURL from "../../helpers/environment";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";

const DeleteUser = (props) => {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();

  /********************
    DELETE USER
    ********************/
  const userRemover = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      let confirmEmail = window.prompt(
        `To confirm removal, please type in this email: ${props.user.email}`
      );
      setLoading(true);
      if (confirmEmail === props.user.email) {
        fetch(`${APIURL}/user/removeUser`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: props.token,
          },
          body: JSON.stringify({
            password,
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else if (res.status === 403) {
              throw new Error("Wrong Password");
            } else {
              throw new Error("Something went wrong");
            }
          })
          .then((data) => {
            setResponse(data.message);
            setLoading(false);
            props.setUpdate(data);
            setTimeout(() => {
              props.clearLogin();
            }, 4000);
          })
          .catch((err) => {
            setErr(err.message);
            setLoading(false);
            setTimeout(() => {
              setErr("");
            }, 2500);
          });
      } else {
        setLoading(false);
        setErr("Emails did not match.");
      }
    } else {
      setResponse("Passwords must match");
      setLoading(false);
      setTimeout(() => {
        setResponse("");
      }, 4000);
    }
  };

  return (
    <div>
      <div>
        <h5>Delete {props.user.firstName}'s Account</h5>
        {/********************
    DELETE USER
    ********************/}
        <Form onSubmit={(e) => userRemover(e)}>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              required
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirm password">Confirm Password</Label>
            <Input
              required
              type="password"
              name="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Input>
          </FormGroup>
          {password !== confirmPassword && password.length > 0 ? (
            <Alert>Passwords must match</Alert>
          ) : (
            <></>
          )}
          <Button type="submit" style={{ width: "100%" }}>
            Submit
          </Button>
          {loading ? <Spinner></Spinner> : <></>}
          {response ? <Alert>{response}</Alert> : <></>}
          {err ? <Alert color="danger">{err}</Alert> : <></>}
        </Form>
      </div>
    </div>
  );
};

export default DeleteUser;
