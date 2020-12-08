import React from "react";
import classes from "../Athlete.module.css";
import FitbitAdderModal from "./fitbitFlow/FitbitAdderModal";
import GarminAdderModal from "./garminFlow/GarminAdderModal";
import ManualActivityAdder from "./ManualActivityAdder";
import { Card, CardBody, CardTitle } from "reactstrap";

const AdderCard = (props) => {
  return (
    <div>
      <Card className={classes.card}>
        <CardBody className={`${classes.cardBody} ${classes.activityCard}`}>
          <CardTitle className={classes.cardTitle} tag="h4">
            <header className={classes.headerText}>Add Activities</header>
          </CardTitle>
          <FitbitAdderModal
            token={props.token}
            fitbitRuns={props.fitbitRuns}
            setFitbitRuns={props.setFitbitRuns}
            setUpdate={props.setUpdate}
            update={props.update}
          />
          <GarminAdderModal />
          <ManualActivityAdder
            token={props.token}
            setUpdate={props.setUpdate}
            response={props.response}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdderCard;
