import React from "react";
import classes from "./HeaderFooter.module.css";
import NobleTech from "../../Assets/noble_tech_icon_white.png";

const Footer = (props) => {
  return (
    <footer className={`thead-dark ${classes.footer}`}>
      <p>Powered by</p>
      <img src={NobleTech} alt="" />
      <p>NobleTech</p>
    </footer>
  );
};

export default Footer;
