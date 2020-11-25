import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Splash from "./components/splashLogin/Splash";

const App = () => {
  const [token, setToken] = useState(null);
  const [isCoach, setIsCoach] = useState();

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
    setToken(localStorage.getItem("token"));
    setIsCoach(localStorage.getItem("isCoach") === "true");
  }, [token]);

  return (
    <div className="App">
      {token ? ( //ternary: If logged in, takes you to the logged in functionality. If not, takes you to splash/marketing page.
        <>
          <Router>
            <Header isCoach={isCoach} clearLogin={clearLogin} token={token} />
          </Router>
        </>
      ) : (
        <>
          <Splash updateToken={updateToken} updateIsCoach={updateIsCoach} />=
        </>
      )}
    </div>
  );
};

export default App;
