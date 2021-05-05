import React, { useState, useRef } from "react";
import classes from "./UpdateInfo.module.scss";
import { UserInfo } from "../../models";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";
import deleter from '../../utilities/deleteFetcher'
import expander from '../../utilities/expander'


interface DeleteUserProps{
  userInfo: UserInfo
  logoutHandler: ()=>void;

}

const DeleteUser:React.FC<DeleteUserProps> = (props) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const responseDivRef = useRef<HTMLDivElement>(null);


  /********************
    DELETE USER
    ********************/
  const userRemover = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === confirmPassword) {
      let confirmEmail = window.prompt(
        `To confirm removal, please type in this email: ${props.userInfo.user.email}`
      );
      if (confirmEmail === props.userInfo.user.email) {
        setResponse("Passwords must match");
        setLoading(false);
        setTimeout(() => {
          setResponse("");
        }, 4000);
      }else{
        try{
          setLoading(true);
        deleter(props.userInfo.token, 'user/removeUser')
          await props.logoutHandler();
          setResponse('Account Deleted');
          //if the time is changed here, it will cause a race with loginHandler, which unmounts this modal. If you change time here, change time in loginHandler in App.tsx.
          setTimeout(() => {
            setResponse('');
          }, 1500);
        } catch (error) {
          console.log(error);
          if (error['response'] !== undefined) {
            setResponse(error.response.data.message);
          } else {
            setResponse('Server Error. Account not deleted');
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
      }       
    }
  };

  return (
    <div className={classes.subDiv}>
      <h5>Delete {props.userInfo.user.firstName}'s Account</h5>
      <Form className={classes.form} onSubmit={(e) => userRemover(e)}>
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
        <div className={classes.responseDiv} ref={responseDivRef}>
            {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
            {response ? <p className={classes.alert}>{response}</p> : <></>}
          </div>
      </Form>
    </div>
  );
};

export default DeleteUser;