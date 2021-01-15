import React, { useState } from "react";
// import APIURL from "../../../../helpers/environment";
import classes from "../../Athlete.module.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap";

const GarminAdderModal = (props) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault(e)}>
        <Button className={classes.launchModalBtn} onClick={toggle}>
          Add Garmin Activities
        </Button>
      </Form>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName="sheetModal"
        className="print"
      >
        <ModalHeader toggle={toggle}>Adder Modal</ModalHeader>
        <ModalBody>
          <h1>Coming Soon</h1>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle} className="modalButton">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default GarminAdderModal;
