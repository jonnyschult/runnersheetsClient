import React from "react";
import FitbitAdderModal from "./activityAdders/fitbitFlow/FitbitAdderModal";
import GarminAdderModal from "./activityAdders/garminFlow/GarminAdderModal";
import ManualActivityAdder from "./activityAdders/ManualActivityAdder";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const AdderCard = (props) => {
  return (
    <div>
      <Card className="bookCard">
        <CardBody className="">
          <CardTitle className="bookCardBodyTitle" tag="h4">
            Add Activities
          </CardTitle>
          <CardText></CardText>
          <FitbitAdderModal
            token={props.token}
            fitbitRuns={props.fitbitRuns}
            setFitbitRuns={props.setFitbitRuns}
            setUpdate={props.setUpdate}
            alreadyAdded={props.alreadyAdded}
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
