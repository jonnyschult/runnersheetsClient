import React, { useState, useRef } from "react";
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
import { UserInfo } from "../../models";

interface UpdatePasswordProps {
  userInfo: UserInfo;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
  const [password, setPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>();
  const [response, setResponse] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const responseDivRef = useRef<HTMLDivElement>(null);

  /********************
    UPDATE USER PASSWORD
  ********************/
  const passwordUpdater = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const info = {
      oldPassword: password,
      newPassword: newPassword,
    };
    const data = await poster("notoken", "users/login", info);

    fetch(`${APIURL}/user/updatePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.userInfo.token,
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
        setResponse(err.message);
        setLoading(false);
        setTimeout(() => {
          setResponse("");
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
        <div className={classes.responseDiv} ref={responseDivRef}>
          {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
          {error ? <p className={classes.alert}>{error}</p> : <></>}
          {response ? <p className={classes.alert}>{response}</p> : <></>}
        </div>
      </Form>
    </div>
  );
};

export default UpdatePassword;
