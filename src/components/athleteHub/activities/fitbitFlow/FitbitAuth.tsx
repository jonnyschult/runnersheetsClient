import React, { useEffect, useState } from "react";
import APIURL from "../../../../utilities/environment";
import classes from "./Fitbit.module.css";
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
import { UserInfo } from "../../../../models";
import { getter, updater } from "../../../../utilities";
import axios from "axios";

interface FibitAuthProps {
  userInfo: UserInfo;
}

//url: `https://api.fitbit.com/oauth2/token?code=${authCode}&grant_type=authorization_code&redirect_uri=${fitbitSecretResults.data.redirectURI}`,

const FitbitAuth: React.FC<FibitAuthProps> = (props) => {
  const token = props.userInfo.token;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  //checks for query parameter, which fitbit returns in their callback uri
  const stringParser = (str: string) => {
    //Gets token from window.location.href
    const query = str.split("?");
    const codePlusHash = query[1].split("code=");
    const code = codePlusHash[1].split("#");
    return code[0];
  };

  useEffect(() => {
    const url = window.location.href;

    const fitbitTokenHandler = async () => {
      try {
        setLoading(true);
        const authCode = stringParser(url);
        const fitbitSecretResults = await getter(token, "fitbit/getSecretId");
        //Used fetch because axios doesn't have a built in stringify function for x-www-form-urlencoded
        const response = await fetch(
          `https://api.fitbit.com/oauth2/token?code=${authCode}&grant_type=authorization_code&redirect_uri=${fitbitSecretResults.data.redirectURI}`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${fitbitSecretResults.data.authorization}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const data = await response.json();
        const updateResults = await updater(token, "users/updateUser", {
          fitbit_refresh: data.refresh_token,
        });
        props.userInfo.user = updateResults.data.updatedUser;
        props.userInfo.setUserInfo!(props.userInfo);
        setResponse("Success");
        setTimeout(() => {
          setResponse("");
        }, 2200);
      } catch (error) {
        console.log(error);
        if (error.response !== undefined && error.response.status < 500) {
          setResponse(error.response.data.message);
        } else {
          setResponse("");
        }
        setTimeout(() => {
          setResponse("");
        }, 2200);
      } finally {
        setLoading(false);
      }
    };
    if (url.includes("?")) {
      fitbitTokenHandler();
    }
  }, [token]);

  const fitbitTokenFetcher = async () => {
    try {
      const clientResults = await getter(token, "fitbit/getAuth");
      window.open(
        `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientResults.data.clientId}&redirect_uri=${clientResults.data.redirectURI}&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight`
      );
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Unable to connect to fitbit");
      }
      setTimeout(() => {
        setResponse("");
      }, 2200);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainDiv}>
        <Card className={classes.fitbitCard}>
          <CardHeader className={classes.fitbitCardHeader}>
            <h1 className={classes.headerText}>Connect Fitbit</h1>{" "}
          </CardHeader>
          <CardBody className={classes.fitbitCardBody}>
            <CardImg src={Fitbit} className={classes.fitbitCardImg} />
            <CardText>
              Connecting Fitbit with RunnerSheets enables you to easily share
              your activities with your coach and fellow runners!
            </CardText>
            <Button
              className={classes.fitbitBtn}
              onClick={(e) => fitbitTokenFetcher()}
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
        </Card>
      </div>
    </div>
  );
};

export default FitbitAuth;
