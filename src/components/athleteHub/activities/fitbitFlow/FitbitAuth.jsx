import React, { useEffect, useState } from "react";
import APIURL from "../../../../helpers/environment";
import classes from "../../Athlete.module.css";
import Fitbit from "../../../../Assets/fitbit.jpg";
import {
  Button,
  Spinner,
  Alert,
  Card,
  CardHeader,
  CardImg,
  CardBody,
  CardText,
} from "reactstrap";

const FitbitAuth = (props) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const [response, setResponse] = useState();
  useEffect(async () => {
    const url = window.location.href;
    if (url.includes("?")) {
      //checks for query parameter, which fitbit returns in their callback uri

      setLoading(true);
      const stringParser = (str) => {
        //Gets token from window.location.href
        const query = str.split("?");
        const codePlusHash = query[1].split("code=");
        const code = codePlusHash[1].split("#");
        return code[0];
      };
      const authCode = stringParser(url);
      fetch(`${APIURL}/fitbit/getSecretId`, {
        //calls to get user secret stored in env.
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          //Call to get refresh token from fitbit
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
                //store refresh token in user table
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
                  setLoading(false);
                });
            })
            .catch((err) => {
              setErr(err.message);
              setLoading(false);
            });
        })
        .catch((err) => {
          setErr(err.message);
          setLoading(false);
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
      })
      .catch((err) => {
        setErr(err.message);
      });
  };
  return (
    <div className={`${classes.mainDiv} ${classes.fitbitMain}`}>
      <Card className={classes.fitbitCard}>
        <CardHeader className={classes.fitbitCardHeader}>
          <h1 className={classes.headerText}>Connect Fitbit</h1>{" "}
        </CardHeader>
        <CardBody className={classes.fitbitCardBody}>
          <CardImg src={Fitbit} className={classes.fitbitCardImg} />
          <CardText>
            Connecting Fitbit with RunnerSheets enables you to easily share your
            activities with your coach and fellow runners!
          </CardText>
          <Button
            className={classes.fitbitBtn}
            onClick={(e) => fitbitFetcher()}
          >
            Connect to Fitbit
          </Button>
        </CardBody>
        {response ? (
          <Alert>
            {response} Please return to Athlete page to upload workouts.
          </Alert>
        ) : (
          <></>
        )}
        {loading ? <Spinner></Spinner> : <></>}
        {err ? <Alert>{err}</Alert> : <></>}
      </Card>
    </div>
  );
};

export default FitbitAuth;
