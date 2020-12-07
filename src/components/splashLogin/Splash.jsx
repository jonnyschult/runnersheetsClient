import React, { useEffect, useState } from "react";
import { Jumbotron, Button } from "reactstrap";
import RegisterModal from "./RegisterModal";
import classes from "./Splash.module.css";
import jumbotronMov from "../../Assets/bg-video-no-fade.mov";

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
        <video autoPlay muted loop className={classes.video}>
          <source src={jumbotronMov} type="video/mp4" />
        </video>
        <div className={classes.container}>
          <h1 className={`display-4 ${classes.jumbotronHeader}`}>
            Welcome to Runner Sheets
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
              Hello
            </h1>
            <p className={`${classes.textA} ${classes.textAOne}`}>
              Create or upload activities
            </p>
            <p className={`${classes.textA} ${classes.textATwo}`}>
              See coaches plans and challenges
            </p>
            <p className={`${classes.textA} ${classes.textAThree}`}>
              Eat as much pie as they want
            </p>
          </div>
        </div>
        <div className={classes.leftSlash}>
          <div className={pageTwo ? classes.textBoxActive : classes.textBox}>
            <h1 className={`${classes.textHeaderB} ${classes.textHeader}`}>
              Coaches Can
            </h1>
            <p className={`${classes.textB} ${classes.textBOne}`}>
              Create or upload activities
            </p>
            <p className={`${classes.textB} ${classes.textBTwo}`}>
              See coaches plans and challenges
            </p>
            <p className={`${classes.textB} ${classes.textBThree}`}>
              Eat as much pie as they want
            </p>
          </div>
        </div>
      </div>
      <div className={`${classes.contentContainer} ${classes.containerB}`}>
        <div className={classes.rightSlash}>
          <div className={pageThree ? classes.textBoxActive : classes.textBox}>
            <h1 className={`${classes.textHeaderA} ${classes.textHeader}`}>
              Athletes Can
            </h1>
            <p className={`${classes.textA} ${classes.textAOne}`}>
              Create or upload activities
            </p>
            <p className={`${classes.textA} ${classes.textATwo}`}>
              See coaches plans and challenges
            </p>
            <p className={`${classes.textA} ${classes.textAThree}`}>
              Eat as much pie as they want
            </p>
          </div>
        </div>
        <div className={classes.leftSlash}>
          <div className={pageFour ? classes.textBoxActive : classes.textBox}>
            <h1 className={`${classes.textHeaderB} ${classes.textHeader}`}>
              Coaches Can
            </h1>
            <p className={`${classes.textB} ${classes.textBOne}`}>
              Create or upload activities
            </p>
            <p className={`${classes.textB} ${classes.textBTwo}`}>
              See coaches plans and challenges
            </p>
            <p className={`${classes.textB} ${classes.textBThree}`}>
              Eat as much pie as they want
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Splash;
