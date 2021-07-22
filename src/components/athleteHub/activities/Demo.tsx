import React, { useState } from "react";
import classes from "../Athlete.module.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import { UserInfo, Activity, Club } from "../../../models";
import { poster } from "../../../utilities";

interface DemoProps {
  userInfo: UserInfo;
  startDate: number;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const Demo: React.FC<DemoProps> = (props) => {
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const toggle = () => {
    setModal(!modal);
  };

  /***************************
  ADD ACTIVITY TO DATABASE
  ***************************/
  const activitiesGenerator = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const results = await poster(
        props.userInfo.token,
        "demo/createActivities",
        { password: password }
      );
      setResponse("Success");
      const currentActivities = results.data.generatedActivities.filter(
        (act: Activity) => act.date > props.startDate
      );
      console.log(currentActivities);
      props.setActivities(currentActivities);
      const sortedClubs = results.data.generatedClubs.sort(
        (a: Club, b: Club) => {
          if (a.club_name > b.club_name) {
            return 1;
          } else {
            return -1;
          }
        }
      );
      props.userInfo.clubs = sortedClubs;
      props.userInfo.setUserInfo!(props.userInfo);
      setTimeout(() => {
        setResponse("");
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Could not add run. Server error");
      }
      setTimeout(() => {
        setResponse("");
      }, 2200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <Button className={classes.launchModalBtn} onClick={toggle}>
          Create Demo Data
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName={classes.sheetModal}
        className={`print ${classes.modal}`}
      >
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header className={classes.headerText}>Fitbit Activities</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <Form
            className={classes.form}
            onSubmit={(e) => activitiesGenerator(e)}
          >
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                required
                type="text"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
            </FormGroup>
            <Button
              className={`${classes.modalBtn} ${classes.activitiesBtn}`}
              type="submit"
            >
              Generate activities
            </Button>
          </Form>

          {response ? <Alert>{response}</Alert> : <></>}
          {loading ? <Spinner></Spinner> : <></>}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={toggle}
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
          >
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Demo;
