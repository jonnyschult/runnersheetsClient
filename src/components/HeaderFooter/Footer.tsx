import React from "react";
import classes from "./HeaderFooter.module.css";
import NobleTech from "../../Assets/noble_tech_icon_white.png";

const Footer:React.FC = () => {
  return (
    <footer className={`thead-dark ${classes.footer}`}>
      <p>Powered by</p>
      <img src={NobleTech} alt="" />
      <p>NobleTech</p>
      <p className={classes.copyright}>copyright 2020</p>
    </footer>
  );
};

export default Footer;
