import React from "react";
import CollatedWorkouts from "./CollatedWorkouts";
import { Form, FormGroup, Label, Input } from "reactstrap";

const FetchDetailer = (props) => {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormGroup>
        <legend>View Training Interval</legend>
        <Label htmlFor="week">
          <Input
            defaultChecked="true"
            type="radio"
            name="radio1"
            className="radio1"
            onChange={(e) => {
              props.setEndDate(new Date(Date.now()).getTime()); //resets the endDate incase they have set it with a custom value
              props.setStartDate(new Date(Date.now() - 604800000).getTime()); //number of miliseconds from a week ago.
              document
                .querySelectorAll(".date")
                .forEach((date) => (date.value = "")); //resets the values for other date options
            }}
          />
          Week
        </Label>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="4 weeks">
          <Input
            type="radio"
            name="radio1"
            className="radio1"
            onChange={(e) => {
              props.setEndDate(new Date(Date.now()).getTime()); //resets the endDate incase they have set it with a custom value
              props.setStartDate(new Date(Date.now() - 2419200000).getTime()); //number of miliseconds from 4 weeks ago.
              document
                .querySelectorAll(".date")
                .forEach((date) => (date.value = "")); //resets the values for other date options
            }}
          />
          4 Weeks
        </Label>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="12 weeks">
          <Input
            type="radio"
            name="radio1"
            className="radio1"
            onChange={(e) => {
              props.setEndDate(new Date(Date.now()).getTime()); //resets the endDate incase they have set it with a custom value
              props.setStartDate(new Date(Date.now() - 7257600000).getTime()); //number of miliseconds from 12 weeks ago.
              document
                .querySelectorAll(".date")
                .forEach((date) => (date.value = "")); //resets the values for other date options
            }}
          />
          12 weeks
        </Label>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="year">
          <Input
            type="radio"
            name="radio1"
            className="radio1"
            onChange={(e) => {
              props.setEndDate(new Date(Date.now()).getTime()); //resets the endDate incase they have set it with a custom value
              props.setStartDate(new Date(Date.now() - 31449600000).getTime()); //minus 1 year of miliseconds
              document
                .querySelectorAll(".date")
                .forEach((date) => (date.value = "")); //resets the values for other date options
            }}
          />
          Year
        </Label>
      </FormGroup>
      <FormGroup>
        <legend>Custom Date</legend>
        <Label htmlFor="start date">Start Date</Label>
        <Input
          type="Date"
          name="start date"
          className="date"
          onChange={(e) => {
            props.setStartDate(new Date(e.target.value).getTime());
            document
              .querySelectorAll(".radio1")
              .forEach((radio) => (radio.checked = false)); //Deselects all radios to prevent confusion.
          }}
        ></Input>
        <Label htmlFor="end date">End Date</Label>
        <Input
          type="Date"
          name="end date"
          className="date"
          onChange={(e) => {
            props.setEndDate(new Date(e.target.value).getTime());
            document
              .querySelectorAll(".radio1")
              .forEach((radio) => (radio.checked = false)); //Deselects all radios to prevent confusion.
          }}
        ></Input>
      </FormGroup>
      <h5>View Collated Workouts</h5>
      <CollatedWorkouts teamActivities={props.teamActivities} />
    </Form>
  );
};

export default FetchDetailer;
