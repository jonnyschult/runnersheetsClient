import React, { useState } from "react";
import classes from "./Athlete.module.css";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";
import { User, UserInfo } from "../../models";
import { updater } from "../../utilities";

interface AthleteUpdaterProps {
  userInfo: UserInfo;
  athlete: User;
  setAthlete: React.Dispatch<React.SetStateAction<User>>;
}

const AthleteUpdater: React.FC<AthleteUpdaterProps> = (props) => {
  const athlete = props.athlete;
  const [feet, setFeet] = useState<number | undefined>(
    athlete.height_inches ? Math.floor(athlete.height_inches / 12) : undefined
  );
  const [inches, setInches] = useState<number | undefined>(
    athlete.height_inches ? athlete.height_inches % 12 : undefined
  );
  const [weight, setWeight] = useState<number | undefined>(
    athlete.weight_pounds
  );
  const [DOB, setDOB] = useState<string>(athlete.date_of_birth);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const toggle = () => setModal(!modal);

  const updateInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let height: undefined | number = undefined;
      if (feet && inches) {
        height = feet * 12 + inches;
      }
      const info: User = {
        email: athlete.email,
        first_name: athlete.first_name,
        last_name: athlete.last_name,
        date_of_birth: DOB,
        weight_pounds: weight,
        height_inches: height,
        premium_user: athlete.premium_user,
        coach: athlete.coach,
      };
      const response = await updater(
        props.userInfo.token,
        "users/updateUser",
        info
      );

      props.userInfo.user = response.data.updatedUser;
      props.userInfo.setUserInfo!(props.userInfo);
      props.setAthlete(response.data.updatedUser);
      setResponse("Update Successful");
      setTimeout(() => {
        setResponse("");
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not update user. Server error");
      }
      setTimeout(() => {
        setResponse("");
        toggle();
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault}>
        <h6 className={classes.adderModalButton} onClick={toggle}>
          +
        </h6>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName="sheetModal"
        className={`print ${classes.modal}`}
      >
        <ModalHeader className={classes.modalHeader}>
          <header className={classes.headerText}>Update Athlete Metrics</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form className={classes.form} onSubmit={(e) => updateInfo(e)}>
            <FormGroup style={{ display: "flex" }}>
              <span> Height</span>
              <Label htmlFor="feet">Feet</Label>
              <Input
                type="number"
                name="feet"
                defaultValue={feet}
                onChange={(e) => setFeet(parseInt(e.target.value))}
              ></Input>
              <Label htmlFor="inches">Inches</Label>
              <Input
                type="number"
                name="inches"
                defaultValue={inches}
                onChange={(e) => setInches(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="weight">Weight</Label>
              <Input
                type="number"
                name="weight"
                placeholder={`${athlete.weight_pounds}`}
                onChange={(e) => setWeight(parseInt(e.target.value))}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="DOB">DOB</Label>
              <Input
                type="date"
                name="DOB"
                placeholder={athlete.date_of_birth}
                onChange={(e) => setDOB(e.target.value)}
              ></Input>
            </FormGroup>
            <Button
              className={`${classes.modalBtn} ${classes.addBtn}`}
              type="submit"
            >
              Submit
            </Button>
            {response ? (
              <Alert className={classes.responseAlert}>{response}</Alert>
            ) : (
              <></>
            )}
            {loading ? <Spinner></Spinner> : <></>}
          </Form>
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
            onClick={toggle}
          >
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AthleteUpdater;
