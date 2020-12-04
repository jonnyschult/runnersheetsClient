import React from "react";
import { Jumbotron, Button } from "reactstrap";
import RegisterModal from "./RegisterModal";
import classes from "./Splash.module.css";
import jumbotronMov from "../../Assets/bg-video-no-fade.mov";
import backupPhoto from "../../Assets/backupPhoto.jpg";
import histogram from "../../Assets/histogram.png";

const Splash = (props) => {
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
          <h1 className="display-4">Welcome to Runner Sheets</h1>
          <p className="lead">Data Communication for Informed Coaching.</p>
          <RegisterModal
            className={classes.zpop}
            updateToken={props.updateToken}
            updateIsCoach={props.updateIsCoach}
          />
        </div>
      </Jumbotron>
      <div className={`${classes.contentContainer} ${classes.containerOne}`}>
        <div className={classes.contentTextA}>
          <h3>Running Sheets has features</h3>
          <p>
            With our state of the art web design and interconnected data
            storage, you are able to view your athletes workouts and issue
            challenges
          </p>
        </div>
        <div className={classes.contentTextB}>
          Caramels bonbon ice cream tiramisu oat cake pudding jelly-o. Jelly
          beans dessert candy canes jelly candy canes caramels soufflé cotton
          candy jelly beans. Topping chocolate cake marzipan croissant brownie
          chocolate cake soufflé liquorice muffin. Topping dragée marshmallow
          apple pie. Cookie oat cake chocolate bar biscuit icing tiramisu.
          Toffee oat cake marzipan cotton candy lollipop cheesecake toffee
          biscuit icing caramels. Cookie apple pie macaroon candy canes caramels
          halvah gingerbread soufflé. Sweet roll brownie gummies. Pastry dragée
          sugar plum toffee. Pie pastry bonbon pastry marshmallow carrot cake
          powder cookie cookie. Cotton candy sweet roll cookie lemon drops
          biscuit tiramisu apple pie caramels lemon drops. Dragée gummies
          croissant chocolate bar liquorice carrot cake.
        </div>
      </div>
      <div className={`${classes.contentContainer} ${classes.containerTwo}`}>
        <div className={classes.contentTextA}>
          <h3>Running Sheets has features</h3>
          <p>
            With our state of the art web design and interconnected data
            storage, you are able to view your athletes workouts and issue
            challenges
          </p>
        </div>
        <div className={classes.contentTextB}>
          Caramels bonbon ice cream tiramisu oat cake pudding jelly-o. Jelly
          beans dessert candy canes jelly candy canes caramels soufflé cotton
          candy jelly beans. Topping chocolate cake marzipan croissant brownie
          chocolate cake soufflé liquorice muffin. Topping dragée marshmallow
          apple pie. Cookie oat cake chocolate bar biscuit icing tiramisu.
          Toffee oat cake marzipan cotton candy lollipop cheesecake toffee
          biscuit icing caramels. Cookie apple pie macaroon candy canes caramels
          halvah gingerbread soufflé. Sweet roll brownie gummies. Pastry dragée
          sugar plum toffee. Pie pastry bonbon pastry marshmallow carrot cake
          powder cookie cookie. Cotton candy sweet roll cookie lemon drops
          biscuit tiramisu apple pie caramels lemon drops. Dragée gummies
          croissant chocolate bar liquorice carrot cake.
        </div>
      </div>
    </>
  );
};

export default Splash;
