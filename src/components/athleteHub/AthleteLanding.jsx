import React, { useEffect, useState } from "react";
import APIURL from "../../helpers/environment";
import { Button } from "reactstrap";

const AthleteLanding = (props) => {
  const [fitbitAccess, setFitbitAccess] = useState();

  const fitbitActivities = async () => {
    //todo: set access token to local storage instead fo calling refresh everytime.
    console.log("Hello");
    fetch(`${APIURL}/user/getAthlete`, {
      //Gets refresh token 64encoded client id and client secret
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        fetch(
          `https://api.fitbit.com/oauth2/token?&grant_type=refresh_token&refresh_token=${data.athlete.fitbitRefresh}`, //refreshes the refresh token and gives access token.
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${data.authorization}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data.refresh_token, data.access_token);
            fetch(`${APIURL}/user/updateUser`, {
              //Saves new update token to database
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: props.token,
              },
              body: JSON.stringify({
                fitbitRefresh: data.refresh_token,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Hello", data.message);
              })
              .catch((err) => {
                console.log(err);
              });
            fetch(
              `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2020-09-01&sort=asc&offset=0&limit=100`,
              {
                //get's fitbit data
                headers: {
                  Authorization: `Bearer ${data.access_token}`,
                },
              }
            )
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Hello Athlete</h1>
      <Button onClick={(e) => fitbitActivities()}>Test Fetch</Button>{" "}
    </div>
  );
};

export default AthleteLanding;
