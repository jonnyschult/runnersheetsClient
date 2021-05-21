import React, { useState, useRef } from "react";
import classes from "./Modal.module.scss";
import {
  Button,
  Form,
  FormGroup,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import poster from "../../utilities/postFetcher";
import expander from "../../utilities/expander";

interface LoginProps {
  loginHandler: (token: string) => void;
  registerToggle: () => void;
}

const Login: React.FC<LoginProps> = (props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const responseDivRef = useRef<HTMLDivElement>(null);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const info = { email, password };
      const response = await poster("notoken", "users/login", info);
      await props.loginHandler(response.data.token);
      setResponse("Login Successful");
      //if the time is changed here, it will cause a race with loginHandler, which unmounts this modal. If you change time here, change time in loginHandler in App.tsx.
      setTimeout(() => {
        setResponse("");
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined) {
        setError(error.response.data.message);
      } else {
        setError("Problem creating your account. Please let site admin know");
      }
      setTimeout(() => {
        setError("");
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
          <div className={classes.responseDiv} ref={responseDivRef}>
            {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
            {error ? <p className={classes.alert}>{error}</p> : <></>}
            {response ? <p className={classes.alert}>{response}</p> : <></>}
          </div>
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
