import React from "react";
import APIURL from "../../helpers/environment";
import { Button } from "reactstrap";

const AthleteLanding = (props) => {
  const fitbitFetcher = () => {
    fetch(`${APIURL}/fitbit/fitbitCS`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        window.open(
          `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${data.cs}&redirect_uri=${data.redirectURI}&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight`
        );
        console.log(data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1>Hello Athlete</h1>{" "}
      <Button onClick={(e) => fitbitFetcher()}>Test Fetch</Button>{" "}
    </div>
  );
};

export default AthleteLanding;
/*
https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22942C&redirect_uri=https%3A%2F%2Fexample.com%2Ffitbit_auth&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight
*/
