import React, { useState, useRef } from "react";
import classes from "./UpdateInfo.module.scss";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";
import { PasswordUpdate, UserInfo } from "../../models";
import updater from "../../utilities/updateFetcher";
import expander from "../../utilities/expander";

interface UpdatePasswordProps {
  userInfo: UserInfo;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [response, setResponse] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const responseDivRef = useRef<HTMLDivElement>(null);

  /********************
    UPDATE USER PASSWORD
  ********************/
  const passwordUpdater = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const info: PasswordUpdate = {
        oldPassword: password,
        newPassword: newPassword,
      };
      const response = await updater(props.userInfo.token, "users/login", info);
      if (response.status === 403) {
        throw new Error("Wrong Password");
      }
      setResponse("Login Successful");
      setTimeout(() => {
        setResponse("");
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Server Error. Account not Updated");
      }
      setTimeout(() => {
        setResponse("");
      }, 2500);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
      }, 2200);
    }
  };

  return (
    <div className={classes.subDiv}>
      <h5>Update {props.userInfo.user.first_name}'s Password</h5>
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
          {response ? <p className={classes.alert}>{response}</p> : <></>}
        </div>
      </Form>
    </div>
  );
};

export default UpdatePassword;
