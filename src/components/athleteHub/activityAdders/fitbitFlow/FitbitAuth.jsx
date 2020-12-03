import React, { useEffect, useState } from "react";
import APIURL from "../../../../helpers/environment";
import { Button, Spinner, Alert } from "reactstrap";

const FitbitAuth = (props) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const [response, setResponse] = useState();
  useEffect(async () => {
    const url = window.location.href;
    // console.log(window.location.href);
    if (url.includes("?")) {
      //checks for query parameter, which fitbit returns in their callback uri

      setLoading(true);
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
            `https://api.fitbit.com/oauth2/token?code=${authCode}&grant_type=authorization_code&redirect_uri=${data.redirectURI}`,
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
                  setResponse(data.message);
                  setLoading(false);
                })
                .catch((err) => {
                  setErr(err.message);
                });
            })
            .catch((err) => {
              setErr(err.message);
            });
        })
        .catch((err) => {
          setErr(err.message);
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
        await setResponse(data.message);
        window.open(
          `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${data.clientId}&redirect_uri=${data.redirectURI}&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight`
        );
      })
      .catch((err) => {
        setErr(err.message);
      });
  };
  return (
    <div>
      <h1>Connect Fitbit</h1>{" "}
      <Button onClick={(e) => fitbitFetcher()}>Connect to Fitbit</Button>
      {response ? (
        <Alert>
          {response}! Please return to Athlete page to upload workouts.
        </Alert>
      ) : (
        <></>
      )}
      {loading ? <Spinner></Spinner> : <></>}
      {err ? <Alert>{err}</Alert> : <></>}
    </div>
  );
};

export default FitbitAuth;
