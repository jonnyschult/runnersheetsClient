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
              props.setStartDate(new Date(Date.now() - 604800000)); //number of miliseconds from a week ago.
              document
                .querySelectorAll(".date")
                .forEach((date) => (date.value = ""));
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
              props.setStartDate(new Date(Date.now() - 2419200000)); //number of miliseconds from 4 weeks ago.
              document
                .querySelectorAll(".date")
                .forEach((date) => (date.value = ""));
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
              props.setStartDate(new Date(Date.now() - 7257600000)); //number of miliseconds from 12 weeks ago.
              document
                .querySelectorAll(".date")
                .forEach((date) => (date.value = ""));
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
              props.setStartDate(new Date(Date.now() - 31449600000)); //minus 1 year of miliseconds
              document
                .querySelectorAll(".date")
                .forEach((date) => (date.value = ""));
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
            props.setStartDate(e.target.value);
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
            props.setEndDate(e.target.value);
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
