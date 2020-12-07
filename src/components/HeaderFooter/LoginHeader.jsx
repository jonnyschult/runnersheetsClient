import React, { useEffect, useState } from "react";
import classes from "./HeaderFooter.module.css";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import RegisterModal from "../splashLogin/RegisterModal";

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStyle, setActiveStyle] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const changeStyle = () => {
    if (window.scrollY >= 200) {
      setActiveStyle(true);
    } else {
      setActiveStyle(false);
    }
  };

  window.addEventListener("scroll", changeStyle);

  return (
    <header className={`Header ${classes.header}`}>
      <Navbar
        light
        expand="md"
        className={activeStyle ? classes.NavBarActive : classes.NavBar}
      >
        <NavbarBrand href="/">Runner Sheets</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className={classes.Collaspe}>
          <Nav className={classes.Nav}>
            <NavItem>
              <NavLink disabled>Prices</NavLink>
            </NavItem>
          </Nav>
          <Nav className={classes.Nav}>
            <NavItem className={`${classes.NavItem} ${classes.Login}`}>
              <RegisterModal
                className={`${classes.RegisterModal} ${classes.HeaderRegistModal}`}
                updateToken={props.updateToken}
                updateIsCoach={props.updateIsCoach}
              />
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
