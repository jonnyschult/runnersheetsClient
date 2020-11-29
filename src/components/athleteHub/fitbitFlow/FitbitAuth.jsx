import React, { useEffect, useState } from "react";
import APIURL from "../../../helpers/environment";
import { Button } from "reactstrap";

const FitbitAuth = (props) => {
  useEffect(async () => {
    const url = window.location.href;
    // console.log(window.location.href);
    if (url.includes("?")) {
      //checks for query parameter, which fitbit returns in their callback uri

      const stringParser = (str) => {
        //Gets
        const query = str.split("?");
        const codePlusHash = query[1].split("code=");
        const code = codePlusHash[1].split("#");
        console.log(code[0]);
        return code[0];
      };
      const authCode = stringParser(url);
      fetch(`${APIURL}/fitbit/getSecretId`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.authorization);
          console.log(authCode);
          fetch(
            `https://api.fitbit.com/oauth2/token?code=${authCode}&grant_type=authorization_code&redirect_uri=http://localhost:3000/fitbit`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${data.authorization}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
            .then((res) => res.json())
            .then(async (data) => {
              fetch(`${APIURL}/user/updateUser`, {
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
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("No query parameter");
    }
  }, []);

  const fitbitFetcher = () => {
    fetch(`${APIURL}/fitbit/getAuth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        window.open(
          `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${data.clientId}&redirect_uri=${data.redirectURI}&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight`
        );
        console.log(data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1>Connect Fitbit</h1>{" "}
      <Button onClick={(e) => fitbitFetcher()}>Test Fetch</Button>{" "}
    </div>
  );
};

export default FitbitAuth;
