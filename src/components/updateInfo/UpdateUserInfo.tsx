import React, { useState, useRef } from "react";
import classes from "./UpdateInfo.module.scss";
import { Button, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
import { UserInfo, User } from "../../models";
import expander from "../../utilities/expander";
import updater from "../../utilities/updateFetcher";

interface UpdateInfoProps {
  userInfo: UserInfo;
}

const UpdateInfo: React.FC<UpdateInfoProps> = (props) => {
  const [email, setEmail] = useState<string>(props.userInfo.user.email);
  const [first_name, setFirstName] = useState<string>(
    props.userInfo.user.first_name
  );
  const [last_name, setLastName] = useState<string>(
    props.userInfo.user.last_name
  );
  const [response, setResponse] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const responseDivRef = useRef<HTMLDivElement>(null);

  /********************
    UPDATE USER INFO
  ********************/
  const userUpdater = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const info: User = {
        email,
        first_name,
        last_name,
        date_of_birth: props.userInfo.user.date_of_birth,
        premium_user: props.userInfo.user.premium_user,
        coach: props.userInfo.user.coach,
      };
      const response = await updater(
        props.userInfo.token,
        "users/updateUser",
        info
      );
      if (response.status === 404) {
        throw new Error("Error finding your account");
      }
      props.userInfo.user = response.data.updatedUser;
      props.userInfo.setUserInfo!(props.userInfo);
      setResponse("Update Successful");
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
      <h5>Update {props.userInfo.user.first_name}'s Info</h5>
      <Form className={classes.form} onSubmit={(e) => userUpdater(e)}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder={props.userInfo.user.email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="first name">First Name</Label>
          <Input
            type="text"
            name="first name"
            placeholder={props.userInfo.user.first_name}
            onChange={(e) => setFirstName(e.target.value)}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="last name">Last Name</Label>
          <Input
            type="text"
            name="last name"
            placeholder={props.userInfo.user.last_name}
            onChange={(e) => setLastName(e.target.value)}
          ></Input>
        </FormGroup>
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

export default UpdateInfo;
