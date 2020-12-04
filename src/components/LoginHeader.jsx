import React, { useState } from "react";
import { Route, Link, Switch } from "react-router-dom";
import AthleteLanding from "./athleteHub/AthleteLanding";
import FitbitAuth from "./athleteHub/activityAdders/fitbitFlow/FitbitAuth";
import CoachLanding from "./coachHub/CoachLanding";
import UpdateInfoLanding from "./updateInfo/UpdateInfoLanding";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavbarText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div className="Header">
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Runner Sheets</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav>
            <NavItem>Hello</NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
