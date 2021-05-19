import React from "react";
import classes from "../Athlete.module.css";
import FitbitAdderModal from "./fitbitFlow/FitbitAdderModal";
// import GarminAdderModal from "./garminFlow/GarminAdderModal";
import ManualActivityAdder from "./ManualActivityAdder";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Activity, UserInfo } from "../../../models";

interface AdderCardProps {
  userInfo: UserInfo;
  endDate: number;
  startDate: number;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const AdderCard: React.FC<AdderCardProps> = (props) => {
  return (
    <div>
      <Card className={classes.card}>
        <CardBody className={`${classes.cardBody} ${classes.activityCard}`}>
          <CardTitle className={classes.cardTitle} tag="h4">
            <header className={classes.headerText}>Add Activities</header>
          </CardTitle>
          <FitbitAdderModal
            userInfo={props.userInfo}
            activities={props.activities}
            setActivities={props.setActivities}
          />
          <ManualActivityAdder
            userInfo={props.userInfo}
            activities={props.activities}
            setActivities={props.setActivities}
            endDate={props.endDate}
            startDate={props.startDate}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdderCard;
