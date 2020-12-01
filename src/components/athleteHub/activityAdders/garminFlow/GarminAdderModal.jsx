import React, { useEffect, useState } from "react";
import APIURL from "../../../../helpers/environment";
import {
  Button,
  Table,
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

const GarminAdderModal = (props) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <div>
      <Form inline onSubmit={(e) => e.preventDefault(e)}>
        <Button onClick={toggle} style={{ margin: "0 auto" }}>
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
