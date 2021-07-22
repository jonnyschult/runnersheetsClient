import React from "react";
import classes from "../Athlete.module.css";
import Demo from "./Demo";
import FitbitAdderModal from "./fitbitFlow/FitbitAdderModal";
import StravaAdderModal from "./stravaFlow/StravaAdderModal";
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
          <StravaAdderModal
            userInfo={props.userInfo}
            activities={props.activities}
            setActivities={props.setActivities}
            startDate={props.startDate}
          />
          <FitbitAdderModal
            userInfo={props.userInfo}
            activities={props.activities}
            setActivities={props.setActivities}
            startDate={props.startDate}
          />
          <ManualActivityAdder
            userInfo={props.userInfo}
            activities={props.activities}
            setActivities={props.setActivities}
            endDate={props.endDate}
            startDate={props.startDate}
          />
          {window.location.hostname === "localhost" ? (
            <Demo
              userInfo={props.userInfo}
              activities={props.activities}
              setActivities={props.setActivities}
              startDate={props.startDate}
            />
          ) : (
            <></>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdderCard;
