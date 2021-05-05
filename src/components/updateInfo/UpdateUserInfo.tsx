import React, { useState, useRef } from "react";
import classes from "./UpdateInfo.module.css";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import { UserInfo, User } from "../../models";
import expander from '../../utilities/expander'
import updater from '../../utilities/updateFetcher'

interface UpdateInfoProps {
  userInfo: UserInfo
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
}

const UpdateInfo:React.FC<UpdateInfoProps> = (props) => {
  const [email, setEmail] = useState<string>(props.userInfo.user.email);
  const [firstName, setFirstName] = useState<string>(props.userInfo.user.firstName);
  const [lastName, setLastName] = useState<string>(props.userInfo.user.lastName);
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
    try{
      const info: User = {
        email,
        firstName,
        lastName,
        DOB: props.userInfo.user.DOB,
        isPremium: props.userInfo.user.isPremium,
        isCoach: props.userInfo.user.isCoach,
      };
      const response = await updater(props.userInfo.token, "users/login", info);
      if (response.status === 404) {
        throw new Error("Error finding your account");
      }
      props.userInfo.user = response.data.updatedUser
      props.setUserInfo(props.userInfo)
      setResponse('Update Successful');
      setTimeout(() => {
        setResponse('');
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error['response'] !== undefined) {
        setResponse(error.response.data.message);
      } else {
        setResponse('Server Error. Account not Updated');
      }
      setTimeout(() => {
        setResponse('');
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
      <h5>Update {props.userInfo.user.firstName}'s Info</h5>
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
            placeholder={props.userInfo.user.firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="last name">Last Name</Label>
          <Input
            type="text"
            name="last name"
            placeholder={props.userInfo.user.lastName}
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