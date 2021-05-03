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

const UpdatePassword = (props) => {
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();

  /********************
    UPDATE USER PASSWORD
  ********************/
  const passwordUpdater = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${APIURL}/user/updatePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({
        oldPassword: password,
        newPassword: newPassword,
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
      <h5>Update {props.user.firstName}'s Password</h5>
      <Form className={classes.form} onSubmit={(e) => passwordUpdater(e)}>
        <FormGroup>
          <Label htmlFor="current password">Current Password</Label>
          <Input
            required
            type="password"
            name="current password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="new password">New Password</Label>
          <Input
            required
            type="password"
            name="new password"
            onChange={(e) => setNewPassword(e.target.value)}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="Confirm New Password">Confirm New password</Label>
          <Input
            required
            type="password"
            name="Confirm New Password"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          ></Input>
        </FormGroup>
        {newPassword !== confirmNewPassword && confirmNewPassword ? (
          <Alert>New Passwords must match</Alert>
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
  );
};

export default UpdatePassword;
