import React, { useState, useEffect } from "react";
import Header from "./components/HeaderFooter/Header";
import LoginHeader from "./components/HeaderFooter/LoginHeader";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AthleteLanding from "./components/athleteHub/AthleteLanding";
import FitbitAuth from "./components/athleteHub/activities/fitbitFlow/FitbitAuth";
import CoachLanding from "./components/coachHub/CoachLanding";
import ClubLanding from "./components/clubHub/ClubLanding";
import UpdateInfoLanding from "./components/updateInfo/UpdateInfoLanding";
import { UserInfo } from "./models";
import jwt_decode from "jwt-decode";
import "./App.css";
import Splash from "./components/splashLogin/Splash";
import Footer from "./components/HeaderFooter/Footer";
import userDataFetcher from "./utilities/userDataFetcher";

interface decodedToken {
  id: number;
  iat: number;
  exp: number;
}

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    loggedIn: false,
    user: {
      email: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      premium_user: false,
      coach: false,
    },
    teams: [],
    clubs: [],
    activities: [],
    token: "",
  });

  const loginHandler: (userToken: string) => void = async (userToken) => {
    localStorage.setItem("token", userToken);
    let userData = await userDataFetcher(userToken, setUserInfo);
    //prevents unmounting login modal before login message is set in that modal.
    setTimeout(() => {
      setUserInfo(userData);
    }, 1600);
  };

  const logoutHandler: () => void = () => {
    localStorage.clear();
    setUserInfo({
      loggedIn: false,
      user: {
        email: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        premium_user: false,
        coach: false,
      },
      teams: [],
      clubs: [],
      activities: [],
      token: "",
    });
  };

  useEffect(() => {
    document.title = "RunnerSheets";
    let token = localStorage.getItem("token");
    if (token) {
      if (new Date().getTime() > jwt_decode<decodedToken>(token).exp * 1000) {
        logoutHandler();
      } else {
        loginHandler(token);
      }
    }
  }, []);

  return (
    <div className="App">
      {userInfo.loggedIn ? ( //ternary: If logged in, takes you to the logged in functionality. If not, takes you to splash/marketing page.
        <>
          <Router>
            <Header logoutHandler={logoutHandler} />
            <Switch>
              <Route exact path="/">
                {userInfo.user.coach ? (
                  <CoachLanding userInfo={userInfo} />
                ) : (
                  <AthleteLanding userInfo={userInfo} />
                )}
              </Route>
              <Route exact path="/athlete">
                <AthleteLanding userInfo={userInfo} />
              </Route>
              <Route exact path="/clubs">
                <ClubLanding userInfo={userInfo} />
              </Route>
              <Route exact path="/fitbit">
                <FitbitAuth userInfo={userInfo} />
              </Route>

              <Route exact path="/coach">
                <CoachLanding userInfo={userInfo} />
              </Route>
              <Route exact path="/updateInfo">
                <UpdateInfoLanding
                  userInfo={userInfo}
                  logoutHandler={logoutHandler}
                />
              </Route>
            </Switch>
          </Router>
          <Footer />
        </>
      ) : (
        <>
          <LoginHeader loginHandler={loginHandler} />
          <Splash loginHandler={loginHandler} />
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
