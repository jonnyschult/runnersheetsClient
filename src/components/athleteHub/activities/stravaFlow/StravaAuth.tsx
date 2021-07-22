import React, { useEffect, useState } from "react";
import APIURL from "../../../../utilities/environment";
import classes from "./Strava.module.css";
import StravaImg from "../../../../Assets/strava.png";
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
import { getter, poster, updater } from "../../../../utilities";
import axios from "axios";

interface StravaAuthProps {
  userInfo: UserInfo;
}

const StravaAuth: React.FC<StravaAuthProps> = (props) => {
  const token = props.userInfo.token;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  //checks for query parameter, which strava returns in their callback uri
  const stringParser = (str: string) => {
    //Gets token from window.location.href
    const query = str.split("?");
    const codePlusHash = query[1].split("code=");
    const code = codePlusHash[1].split("&scope");
    return code[0];
  };

  useEffect(() => {
    const url = window.location.href;

    const stravaTokenHandler = async () => {
      try {
        setLoading(true);
        const authCode = stringParser(url);
        const results = await poster(token, "strava/createRefresh", {
          authCode: authCode,
        });
        props.userInfo.user = results.data.updatedUser;
        props.userInfo.setUserInfo!(props.userInfo);
        setResponse(
          "Success! You can now add Strava activities on the Athletes page."
        );
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
      stravaTokenHandler();
    }
  }, [token]);

  const stravaTokenFetcher = async () => {
    try {
      const results = await getter(token, "strava/getData");
      window.open(
        `http://www.strava.com/oauth/authorize?client_id=${results.data.stravaID}&response_type=code&redirect_uri=${results.data.redirectURI}&approval_prompt=force&scope=read,activity:read`
      );
    } catch (error) {
      console.log(error);
      if (error.response !== undefined && error.response.status < 500) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Unable to connect to strava");
      }
      setTimeout(() => {
        setResponse("");
      }, 2200);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainDiv}>
        <Card className={classes.stravaCard}>
          <CardHeader className={classes.stravaCardHeader}>
            <h1 className={classes.headerText}>Connect Strava</h1>{" "}
          </CardHeader>
          <CardBody className={classes.stravaCardBody}>
            <CardImg src={StravaImg} className={classes.stravaCardImg} />
            <CardText>
              Connecting Strava with RunnerSheets enables you to easily share
              your activities with your coach and fellow runners!
            </CardText>
            <Button
              className={classes.stravaBtn}
              onClick={(e) => stravaTokenFetcher()}
            >
              Connect to Strava
            </Button>
          </CardBody>
          {response ? <Alert>{response}</Alert> : <></>}
          {loading ? <Spinner></Spinner> : <></>}
        </Card>
      </div>
    </div>
  );
};

export default StravaAuth;
