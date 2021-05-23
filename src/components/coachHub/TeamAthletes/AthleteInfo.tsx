import React, { useState } from "react";
import classes from "../Coach.module.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Form,
} from "reactstrap";
import { User, UserInfo } from "../../../models";

interface AthleteModalProps {
  userInfo: UserInfo;
  athlete: User;
}

const AthleteModal: React.FC<AthleteModalProps> = (props) => {
  const athlete = props.athlete;
  const [modal, setModal] = useState<boolean>(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Form>
        <p className={classes.cardItem} onClick={toggle}>
          <b>{`${athlete.first_name} ${athlete.last_name}`}</b>
        </p>
      </Form>
      <Modal className={classes.modal} isOpen={modal} toggle={toggle}>
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header
            className={classes.headerText}
          >{`${athlete.first_name} ${athlete.last_name}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <p>{`Email:   ${athlete.email}`}</p>
          <p>{`DOB:   ${athlete.date_of_birth.substring(10, 0)}`}</p>
          {athlete.weight_pounds ? (
            <p>{`Weight:   ${athlete.weight_pounds}lbs`}</p>
          ) : (
            <></>
          )}
          {athlete.height_inches ? (
            <p>{`Height:   ${Math.floor(athlete.height_inches / 12)}' ${
              athlete.height_inches % 12
            }"`}</p>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button
            className={`${classes.modalBtn} ${classes.cancelBtn}`}
            color="primary"
            onClick={toggle}
          >
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AthleteModal;
