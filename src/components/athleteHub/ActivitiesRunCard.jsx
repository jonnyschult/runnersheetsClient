import React from "react";
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
          <h5>Run</h5>
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
              <tr>
                <th scope="row">{props.index}</th>
                <td>{new Date(props.run.date).toDateString()}</td>
                <td>
                  {props.run.meters
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td>
                  {new Date(props.run.durationSecs * 1000)
                    .toISOString()
                    .substr(11, 8)}
                </td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default RunCard;
