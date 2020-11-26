import React from "react";
import ActivitiesModal from "./ActivitiesModal";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Table,
} from "reactstrap";

function timeConverter(seconds) {
  let remainingSecs = seconds % 60;
  let minutes = Math.floor(seconds / 60);
  let time = minutes + remainingSecs / 100;
  return time.toFixed(2);
}

const RunCard = (props) => {
  return (
    <div>
      <Card className="bookCard">
        <CardTitle>
          <h5>{`${props.athlete.firstName} ${props.athlete.lastName}`}</h5>
        </CardTitle>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Meters</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {props.athlete.activities.map((activity, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{new Date(activity.date).toDateString()}</td>
                    <td>
                      {activity.meters
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {new Date(activity.durationSecs * 1000)
                        .toISOString()
                        .substr(11, 8)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <ActivitiesModal athlete={props.athlete} />
        </CardBody>
      </Card>
    </div>
  );
};

export default RunCard;
