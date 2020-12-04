import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import { Button, Form, Modal } from "reactstrap";
import classes from "./Splash.module.css";

const RegisterModal = (props) => {
  const [modal, setModal] = useState(false);
  const [register, setRegister] = useState(true);

  const toggle = () => setModal(!modal);
  const registerToggle = () => setRegister(!register);

  return (
    <div>
      <Form onSubmit={(e) => e.preventDefault}>
        <button
          className={classes.signUp}
          onClick={(e) => {
            toggle();
            e.preventDefault();
          }}
        >
          + Youself or Sign In
        </button>
      </Form>
      <Modal isOpen={modal} toggle={toggle}>
        {register ? (
          <Register
            registerToggle={registerToggle}
            updateToken={props.updateToken}
          />
        ) : (
          <Login
            registerToggle={registerToggle}
            updateToken={props.updateToken}
            updateIsCoach={props.updateIsCoach}
          />
        )}
      </Modal>
    </div>
  );
};

export default RegisterModal;
