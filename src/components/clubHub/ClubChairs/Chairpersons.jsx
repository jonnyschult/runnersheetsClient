import React from "react";
import classes from "../Club.module.css";
import ChairAdderModal from "./ChairAdderModal";
import ChairModal from "./ChairModal";
import {
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";

const Chairpersons = (props) => {
  return (
    <div>
      <Card className={classes.leftContainerCard}>
        <CardBody className={classes.leftContainerCardBody}>
          <CardTitle className={classes.leftContainerCardTitle}>
            Chairperson
          </CardTitle>
          {props.chairpersons.length > 0 ? (
            props.chairpersons.map((chairperson, index) => {
              return (
                <ChairModal
                  key={index}
                  chairperson={chairperson}
                  selectedClub={props.selectedClub}
                  fetchChairpersons={props.fetchChairpersons}
                  token={props.token}
                />
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <ChairAdderModal
          fetchChairpersons={props.fetchChairpersons}
          selectedClub={props.selectedClub}
          token={props.token}
        />
      </Card>
    </div>
  );
};

export default Chairpersons;
