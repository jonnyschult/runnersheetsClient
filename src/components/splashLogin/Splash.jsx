import React, { useEffect, useState } from "react";
import { Jumbotron, Button } from "reactstrap";
import RegisterModal from "./RegisterModal";
import classes from "./Splash.module.css";
import jumbotronMov from "../../Assets/bg-video-no-fade.mov";
import Fitbit from "../../Assets/fitbit.png";
import BackupPhoto from "../../Assets/backupPhoto.jpg";

const Splash = (props) => {
  const [pageOne, setPageOne] = useState(false);
  const [pageTwo, setPageTwo] = useState(false);
  const [pageThree, setPageThree] = useState(false);
  const [pageFour, setPageFour] = useState(false);

  const changeStyle = () => {
    if (window.scrollY >= 200) {
      setPageOne(true);
    } else {
      setPageOne(false);
    }
    if (window.scrollY >= 400) {
      setPageTwo(true);
    } else {
      setPageTwo(false);
    }
    if (window.scrollY >= 800) {
      setPageThree(true);
    } else {
      setPageThree(false);
    }
    if (window.scrollY >= 1200) {
      setPageFour(true);
    } else {
      setPageFour(false);
    }
  };

  window.addEventListener("scroll", changeStyle);

  return (
    <>
      <Jumbotron
        fluid
        className={classes.jumbotron}
        // className="jumbotron jumbotron-fluid"
      >
        <video
          autoPlay
          muted
          loop
          className={classes.video}
          poster={BackupPhoto}
        >
          <source src={jumbotronMov} type="video/mp4" />
        </video>
        <div className={classes.container}>
          <h1 className={`display-4 ${classes.jumbotronHeader}`}>
            Welcome to RunnerSheets
          </h1>
          <h3 className={`${classes.subHeader}`}>
            Data Communication for Informed Coaching
          </h3>

          <RegisterModal
            updateToken={props.updateToken}
            updateIsCoach={props.updateIsCoach}
          />
          <div className={classes.quote}>
            <p>
              {" "}
              <i>
                "100% of me is nothing compared to 1% of the entire team"
              </i>{" "}
              <br /> Eliud Kipchoge{" "}
            </p>
          </div>
        </div>
      </Jumbotron>
      <div className={`${classes.contentContainer} ${classes.containerA}`}>
        <div className={classes.rightSlash}>
          <div className={pageOne ? classes.textBoxActive : classes.textBox}>
            <h1 className={`${classes.textHeaderA} ${classes.textHeader}`}>
              Coaches
            </h1>
            <p
              className={`${classes.text} ${classes.textA} ${classes.textAOne}`}
            >
              Create and manage multiple teams, all easily viewed from the
              coaches hub
            </p>
            <p
              className={`${classes.text} ${classes.textA} ${classes.textATwo}`}
            >
              View and edit athlete activities
            </p>
            <p
              className={`${classes.text} ${classes.textA} ${classes.textAThree}`}
            >
              Add everyone to the team, including assistant coaches and managers
            </p>
          </div>
        </div>
        <div className={classes.leftSlash}>
          <div className={pageTwo ? classes.textBoxActive : classes.textBox}>
            <h1 className={`${classes.textHeaderB} ${classes.textHeader}`}>
              Athletes
            </h1>
            <p
              className={`${classes.text} ${classes.textB} ${classes.textBOne}`}
            >
              Easily upload activities from Fitbit
              <img className={classes.fitbitImg} src={Fitbit} alt="" />
            </p>
            <p
              className={`${classes.text} ${classes.textB} ${classes.textBTwo}`}
            >
              View associated teams
            </p>
            <p
              className={`${classes.text} ${classes.textB} ${classes.textBThree}`}
            >
              Store all running information in one location for coaches and
              clubs to see
            </p>
          </div>
        </div>
      </div>
      <div className={`${classes.contentContainer} ${classes.containerB}`}>
        <div className={classes.rightSlash}>
          <div className={pageThree ? classes.textBoxActive : classes.textBox}>
            <h1 className={`${classes.textHeaderA} ${classes.textHeader}`}>
              Clubs
            </h1>
            <p
              className={`${classes.text} ${classes.textA} ${classes.textAOne}`}
            >
              Utilize the team focus and functionality to stay connected to any
              runner you invite to your club
            </p>
            <p
              className={`${classes.text} ${classes.textA} ${classes.textATwo}`}
            >
              See activities and offer peer to peer coaching
            </p>
            <p
              className={`${classes.text} ${classes.textA} ${classes.textAThree}`}
            >
              Stay motivated and accountable while interacting with club
              activities
            </p>
          </div>
        </div>
        <div className={classes.leftSlash}>
          <div className={pageFour ? classes.textBoxActive : classes.textBox}>
            <h1 className={`${classes.textHeaderB} ${classes.textHeader}`}>
              Coming Soon
            </h1>
            <p
              className={`${classes.text} ${classes.textB} ${classes.textBOne}`}
            >
              Integration with Garmin activeware
            </p>
            <p
              className={`${classes.text} ${classes.textB} ${classes.textBTwo}`}
            >
              Create Challenges for Athletes
            </p>
            <p
              className={`${classes.text} ${classes.textB} ${classes.textBThree}`}
            >
              Create training plans for your teams
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Splash;
