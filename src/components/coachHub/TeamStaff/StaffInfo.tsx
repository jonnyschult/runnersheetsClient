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

interface StaffModalProps {
  staffer: User;
  userInfo: UserInfo;
}

const StaffModal: React.FC<StaffModalProps> = (props) => {
  const [modal, setModal] = useState<boolean>(false);
  const toggle = () => setModal(!modal);

  return (
    <div>
      <Form inline>
        <p onClick={toggle} className={classes.cardItem}>
          <b>{`${props.staffer.first_name} ${props.staffer.last_name}: `}</b>
          <i> {props.staffer.role}</i>
        </p>
      </Form>
      <Modal className={classes.modal} isOpen={modal} toggle={toggle}>
        <ModalHeader className={classes.modalHeader} toggle={toggle}>
          <header
            className={classes.headerText}
          >{`${props.staffer.first_name} ${props.staffer.last_name}`}</header>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
          <p>{`Email:   ${props.staffer.email}`}</p>
          <p>{`Role:   ${props.staffer.role}`}</p>
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
    </div>
  );
};

export default StaffModal;
