import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import { Form, Modal } from "reactstrap";
import classes from "./Splash.module.css";

interface RegisterModalProps{
  loginHandler: (token:string)=>void;
}

const RegisterModal:React.FC<RegisterModalProps> = (props) => {
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
      <Modal isOpen={modal} toggle={toggle} className={classes.modal}>
        {register ? (
          <Register
            registerToggle={registerToggle}
            loginHandler={props.loginHandler}
          />
        ) : (
          <Login
            registerToggle={registerToggle}
            loginHandler={props.loginHandler}
          />
        )}
      </Modal>
    </div>
  );
};

export default RegisterModal;
