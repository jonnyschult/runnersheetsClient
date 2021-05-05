import React, { useState, useRef } from "react";
import classes from "./Modal.module.css";
import {
  Button,
  Form,
  FormGroup,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";
import poster from '../../utilities/postFetcher'
import expander from '../../utilities/expander'

interface RegisterProps{
  loginHandler: (token:string)=>void;
  registerToggle: () => void;
}

const Register:React.FC<RegisterProps> = (props) => {
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>();
  // const [heightInInches, setHeightInInches] = useState('');
  const [feet, setFeet] = useState<number | null>(null);
  const [inches, setInches] = useState<number | null>(null);
  const [weightInPounds, setWeightInPounds] = useState<number | null>(null);
  const [DOB, setDOB] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>();
  const [error, setError] = useState<string>();
  const responseDivRef = useRef<HTMLDivElement>(null);


  const submitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    if (password !== confirmPassword) {
      setLoading(false);
      setError('Passwords must match');
      setTimeout(() => {
        setError('');
      }, 2500);
    } else {
      try{
        let height = 0;
        if (feet && inches) {
          height = feet * 12 + inches;
        }
        
        const info={
          email,
          firstName,
          lastName,
          password,
          heightInInches: height,
          weightInPounds,
          DOB,
        }
        const response = await poster('notoken', 'users/register', info);
          await props.loginHandler(response.data.token);
          setResponse('Login Successful');
          //if the time is changed here, it will cause a race with loginHandler, which unmounts this modal. If you change time here, change time in loginHandler in App.tsx.
          setTimeout(() => {
            setResponse('');
          }, 1500);
        } catch (error) {
          console.log(error);
          if (error['response'] !== undefined) {
            setError(error.response.response.data.message);
          } else {
            setError('Problem creating your account. Please let site admin know');
          }
          setTimeout(() => {
            setError('');
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
    <>
      <ModalHeader className={classes.modalHeader}>
        Register to Create Teams and Build Plans
      </ModalHeader>
      <ModalBody className={classes.modalBody}>
        <p>* Indicates optional field</p>
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
            <Label htmlFor="password">Create a password</Label>
            <Input
              className={classes.input}
              required
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </FormGroup>
          {password.length < 8 && password.length > 1 ? (
            <Alert>Password must be atleast 8 characters</Alert>
          ) : (
            <></>
          )}
          <FormGroup>
            <Label htmlFor="Confirm Password">Confirm password</Label>
            <Input
              className={classes.input}
              required
              type="password"
              name="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Input>
          </FormGroup>
          {password !== confirmPassword && password.length > 0 ? (
            <Alert>Passwords must match</Alert>
          ) : (
            <></>
          )}
          <FormGroup>
            <Label htmlFor="first name">First Name</Label>
            <Input
              className={classes.input}
              required
              type="text"
              name="first name"
              onChange={(e) => setFirstName(e.target.value)}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="last name">Last Name</Label>
            <Input
              className={classes.input}
              required
              type="text"
              name="last name"
              onChange={(e) => setLastName(e.target.value)}
            ></Input>
          </FormGroup>
          <FormGroup className={classes.height}>
            <p className={classes.heightLabel}>Height:</p>
            <Label htmlFor="feet">Feet:</Label>
            <Input
              className={`${classes.input} ${classes.feet}`}
              type="number"
              name="feet"
              onChange={(e) => setFeet(parseInt(e.target.value))}
            ></Input>
            <Label htmlFor="feet">Inches:</Label>
            <Input
              className={`${classes.input} ${classes.inches}`}
              type="number"
              name="feet"
              onChange={(e) => setInches(parseInt(e.target.value))}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="weight">Weight*</Label>
            <Input
              className={classes.input}
              type="number"
              name="weight"
              onChange={(e) => setWeightInPounds(parseInt(e.target.value))}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="DOB">DOB*</Label>
            <Input
              className={classes.input}
              type="date"
              name="DOB"
              onChange={(e) => setDOB(e.target.value)}
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
        <p className={classes.switchModalText}>Already a user?</p>
        <span className={classes.switchModal} onClick={props.registerToggle}>
          Login
        </span>
      </ModalFooter>
    </>
  );
};

export default Register;
