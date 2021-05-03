import React, { useState } from "react";
import APIURL from "../../utilities/environment";
import classes from "./UpdateInfo.module.css";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";

const UpdateInfo = (props) => {
  const [email, setEmail] = useState(props.user.email);
  const [firstName, setFirstName] = useState(props.user.firstName);
  const [lastName, setLastName] = useState(props.user.lastName);
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();

  /********************
    UPDATE USER INFO
  ********************/
  const userUpdater = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/user/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {
          throw new Error("Error finding your account");
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setResponse(data.message);
        setLoading(false);
        props.setUpdate(data);
        setTimeout(() => {
          setResponse("");
        }, 4000);
      })
      .catch((err) => {
        setErr(err.message);
        setLoading(false);
        setTimeout(() => {
          setErr("");
        }, 4000);
      });
  };

  return (
    <div className={classes.subDiv}>
      <h5>Update {props.user.firstName}'s Info</h5>
      <Form className={classes.form} onSubmit={(e) => userUpdater(e)}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder={props.user.email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="first name">First Name</Label>
          <Input
            type="text"
            name="first name"
            placeholder={props.user.firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="last name">Last Name</Label>
          <Input
            type="text"
            name="last name"
            placeholder={props.user.lastName}
            onChange={(e) => setLastName(e.target.value)}
          ></Input>
        </FormGroup>
        <Button type="submit" style={{ width: "100%" }}>
          Submit
        </Button>
        {loading ? <Spinner></Spinner> : <></>}
        {response ? <Alert>{response}</Alert> : <></>}
        {err ? <Alert color="danger">{err}</Alert> : <></>}
      </Form>
    </div>
  );
};

export default UpdateInfo;
