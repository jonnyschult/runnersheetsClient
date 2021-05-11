import React, { useRef } from "react";
import classes from "../Coach.module.css";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Activity } from "../../../models";

interface SetDatesProps {
  setStartDate: React.Dispatch<React.SetStateAction<number>>;
  setEndDate: React.Dispatch<React.SetStateAction<number>>;
}

const SetDates: React.FC<SetDatesProps> = (props) => {
  const radioInputRefs = useRef<HTMLInputElement[]>([]);
  const dateInputRefs = useRef<HTMLInputElement[]>([]);

  return (
    <Form onSubmit={(e) => e.preventDefault()} className={classes.datesForm}>
      <legend className={classes.datesLegend}>View Training Interval</legend>
      <div className={classes.datesRadiosGroup}>
        <FormGroup className={classes.datesRadios}>
          <Label htmlFor="week">
            <Input
              defaultChecked={true}
              type="radio"
              name="radio1"
              className="radio1"
              innerRef={(el: HTMLInputElement) =>
                (radioInputRefs.current[0] = el!)
              }
              onChange={(e) => {
                props.setEndDate(new Date(Date.now()).getTime()); //resets the endDate incase they have set it with a custom value
                props.setStartDate(new Date(Date.now() - 604800000).getTime()); //number of miliseconds from a week ago.
                dateInputRefs.current.forEach((date) => (date.value = "")); //resets the values for other date options
              }}
            />
            Week
          </Label>
        </FormGroup>

        <FormGroup className={classes.datesRadios}>
          <Label htmlFor="4 weeks">
            <Input
              type="radio"
              name="radio1"
              className="radio1"
              innerRef={(el: HTMLInputElement) =>
                (radioInputRefs.current[1] = el!)
              }
              onChange={(e) => {
                props.setEndDate(new Date(Date.now()).getTime()); //resets the endDate incase they have set it with a custom value
                props.setStartDate(new Date(Date.now() - 2419200000).getTime()); //number of miliseconds from 4 weeks ago.
                dateInputRefs.current.forEach((date) => (date.value = "")); //resets the values for other date options
              }}
            />
            4 Weeks
          </Label>
        </FormGroup>

        <FormGroup className={classes.datesRadios}>
          <Label htmlFor="12 weeks">
            <Input
              type="radio"
              name="radio1"
              className="radio1"
              innerRef={(el: HTMLInputElement) =>
                (radioInputRefs.current[2] = el!)
              }
              onChange={(e) => {
                props.setEndDate(new Date(Date.now()).getTime()); //resets the endDate incase they have set it with a custom value
                props.setStartDate(new Date(Date.now() - 7257600000).getTime()); //number of miliseconds from 12 weeks ago.
                dateInputRefs.current.forEach((date) => (date.value = "")); //resets the values for other date options
              }}
            />
            12 weeks
          </Label>
        </FormGroup>
        <FormGroup className={classes.datesRadios}>
          <Label htmlFor="year">
            <Input
              type="radio"
              name="radio1"
              className="radio1"
              innerRef={(el: HTMLInputElement) =>
                (radioInputRefs.current[3] = el!)
              }
              onChange={(e) => {
                props.setEndDate(new Date(Date.now()).getTime()); //resets the endDate incase they have set it with a custom value
                props.setStartDate(
                  new Date(Date.now() - 31449600000).getTime()
                ); //minus 1 year of miliseconds
                dateInputRefs.current.forEach((date) => (date.value = "")); //resets the values for other date options
              }}
            />
            Year
          </Label>
        </FormGroup>
      </div>
      <FormGroup className={classes.customDates}>
        <legend className={classes.customDatesLegend}>Custom Date</legend>
        <Label htmlFor="start date">Start Date</Label>
        <Input
          type="date"
          name="start date"
          className="date"
          innerRef={(el: HTMLInputElement) => (dateInputRefs.current[0] = el!)}
          onChange={(e) => {
            props.setStartDate(new Date(e.target.value).getTime());
            document;
            radioInputRefs.current.forEach((radio) => (radio.checked = false)); //Deselects all radios to prevent confusion.
          }}
        ></Input>
        <Label htmlFor="end date">End Date</Label>
        <Input
          type="date"
          name="end date"
          className="date"
          innerRef={(el: HTMLInputElement) => (dateInputRefs.current[1] = el!)}
          onChange={(e) => {
            props.setEndDate(new Date(e.target.value).getTime());
            document;
            radioInputRefs.current.forEach((radio) => (radio.checked = false)); //Deselects all radios to prevent confusion.
          }}
        ></Input>
      </FormGroup>
    </Form>
  );
};

export default SetDates;
