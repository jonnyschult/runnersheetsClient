import React, { useState } from "react";
import classes from "./Athlete.module.css";
import AthleteUpdaterModal from "./AthleteUpdaterModal";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { User, UserInfo } from "../../models";

interface AthleteInfoProps {
  userInfo: UserInfo;
}

const AthleteInfo: React.FC<AthleteInfoProps> = (props) => {
  const [athlete, setAthlete] = useState<User>(props.userInfo.user);
  return (
    <div>
      <Card className={classes.card}>
        <CardBody className={classes.cardBody}>
          <CardTitle className={classes.cardTitle} tag="h4">
            Athlete Information
          </CardTitle>
          <CardText className={classes.cardItem}>
            {`Name:     ${athlete.first_name} ${athlete.last_name}`}
          </CardText>
          <CardText
            className={classes.cardItem}
          >{`Email: ${athlete.email}`}</CardText>
          <CardText
            className={classes.cardItem}
          >{`DOB: ${athlete.date_of_birth.substring(10, 0)}`}</CardText>
          <CardText className={classes.cardItem}>
            {athlete.height_inches
              ? `Height: ${Math.floor(athlete.height_inches / 12)}'${
                  athlete.height_inches % 12
                }"`
              : "N/A"}
          </CardText>
          <CardText className={classes.cardItem}>
            {athlete.weight_pounds ? `Weight: ${athlete.weight_pounds}` : "N/A"}
          </CardText>
          <CardText
            className={classes.cardItem}
          >{`Premium Member: ${athlete.premium_user}`}</CardText>
          <AthleteUpdaterModal
            userInfo={props.userInfo}
            athlete={athlete}
            setAthlete={setAthlete}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AthleteInfo;
