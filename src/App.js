import React, { useState, useEffect } from "react";
import Header from "./components/HeaderFooter/Header";
import LoginHeader from "./components/HeaderFooter/LoginHeader";
import { BrowserRouter as Router } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./App.css";
import Splash from "./components/splashLogin/Splash";
import Footer from "./components/HeaderFooter/Footer";

const App = () => {
  const [token, setToken] = useState(null);
  const [isCoach, setIsCoach] = useState();

  useEffect(() => {
    document.title = "RunnerSheets";
  }, []);

  const updateToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };
  const updateIsCoach = (coachStatus) => {
    setIsCoach(coachStatus);
    localStorage.setItem("isCoach", String(coachStatus));
  };

  const clearLogin = () => {
    localStorage.clear();
    setToken("");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (
        new Date().getTime() >
        jwt_decode(localStorage.getItem("token")).exp * 1000
      ) {
        clearLogin();
      } else {
        setToken(localStorage.getItem("token"));
        setIsCoach(localStorage.getItem("isCoach") === "true");
      }
    }
  }, [token]);

  return (
    <div className="App">
      {token ? ( //ternary: If logged in, takes you to the logged in functionality. If not, takes you to splash/marketing page.
        <>
          <Router>
            <Header isCoach={isCoach} clearLogin={clearLogin} token={token} />
          </Router>
          <Footer />
        </>
      ) : (
        <>
          <LoginHeader
            updateToken={updateToken}
            updateIsCoach={updateIsCoach}
          />
          <Splash updateToken={updateToken} updateIsCoach={updateIsCoach} />
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
