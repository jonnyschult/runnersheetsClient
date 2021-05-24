import React, { useState, useRef } from "react";
import classes from "./UpdateInfo.module.scss";
import { UserInfo } from "../../models";
import { Button, Form, Spinner } from "reactstrap";
import deleter from "../../utilities/deleteFetcher";
import expander from "../../utilities/expander";

interface DeleteUserProps {
  userInfo: UserInfo;
  logoutHandler: () => void;
}

const DeleteUser: React.FC<DeleteUserProps> = (props) => {
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const responseDivRef = useRef<HTMLDivElement>(null);

  /********************
    DELETE USER
    ********************/
  const userRemover = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let confirmEmail = window.prompt(
      `To confirm removal, please type in this email: ${props.userInfo.user.email}`
    );
    if (confirmEmail !== props.userInfo.user.email) {
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setResponseMsg("Emails must match.");
      setLoading(false);
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setResponseMsg("");
      }, 4000);
    } else {
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      try {
        setLoading(true);
        await deleter(
          props.userInfo.token,
          `users/deleteUser/${props.userInfo.user.id}`
        );
        setResponseMsg("Account Deleted");
        //if the time is changed here, it will cause a race with loginHandler, which unmounts this modal. If you change time here, change time in loginHandler in App.tsx.
        setTimeout(() => {
          props.logoutHandler();
          setResponseMsg("");
        }, 1500);
      } catch (error) {
        console.log(error);
        if (error.responseMsg !== undefined) {
          setResponseMsg(error.responseMsg.data.message);
        } else {
          setResponseMsg("Server Error. Account not deleted");
        }
        setTimeout(() => {
          setResponseMsg("");
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
  };

  return (
    <div className={classes.subDiv}>
      <h5>Delete {props.userInfo.user.first_name}'s Account</h5>
      <Form className={classes.form} onSubmit={(e) => userRemover(e)}>
        <Button type="submit" style={{ width: "100%" }}>
          Submit
        </Button>
      </Form>
      <div className={classes.responseDiv} ref={responseDivRef}>
        {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
        {responseMsg ? <p className={classes.alert}>{responseMsg}</p> : <></>}
      </div>
    </div>
  );
};

export default DeleteUser;
