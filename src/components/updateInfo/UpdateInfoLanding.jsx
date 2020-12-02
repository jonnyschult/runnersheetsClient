import React, { useState, useEffect } from "react";
import APIURL from "../../helpers/environment";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Sidebar.css";

const UpdateInfoLanding = (props) => {
  const [user, setUser] = useState();
  const [update, setUpdate] = useState();

  /********************
    GET USER
  ********************/
  useEffect(() => {
    fetch(`${APIURL}/user/getAthlete`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        await setUser(data.athlete);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [update]);

  return (
    <Router>
      <Sidebar
        token={props.token}
        user={user}
        setUpdate={setUpdate}
        clearLogin={props.clearLogin}
      ></Sidebar>
    </Router>
  );
};

export default UpdateInfoLanding;
