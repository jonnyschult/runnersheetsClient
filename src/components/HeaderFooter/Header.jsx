import React, { useState } from "react";
import classes from "./HeaderFooter.module.css";
import { Route, Link, Switch } from "react-router-dom";
import AthleteLanding from "../athleteHub/AthleteLanding";
import FitbitAuth from "../athleteHub/activities/fitbitFlow/FitbitAuth";
import CoachLanding from "../coachHub/CoachLanding";
import ClubLanding from '../clubHub/ClubLanding';
import UpdateInfoLanding from "../updateInfo/UpdateInfoLanding";
import GarminAuth from "../athleteHub/activities/garminFlow/GarminAuth";
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
    <div className={`Header ${classes.header}`}>
      <Navbar className={classes.NavBarActive} light expand="md">
        <NavbarBrand href="/">RunnerSheets</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem className={classes.navItem}>
              <NavbarText className={classes.navbarText}>
                <Link className={classes.link} to="/coach">
                  Coaches
                </Link>
              </NavbarText>
            </NavItem>
            <NavItem className={classes.navItem}>
              <NavbarText className={classes.navbarText}>
                <Link className={classes.link} to="/athlete">
                  Athlete
                </Link>
              </NavbarText>
            </NavItem>
            <NavItem className={classes.navItem}>
              <NavbarText className={classes.navbarText}>
                <Link className={classes.link} to="/clubs">
                  Clubs
                </Link>
              </NavbarText>
            </NavItem>
            {/* <NavItem className={classes.navItem}>
              <NavbarText className={classes.navbarText}>Plans</NavbarText>
            </NavItem> */}
          </Nav>
          <Nav>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle className={classes.dropdownToggle} nav caret>
                Settings
              </DropdownToggle>
              <DropdownMenu className={classes.dropdownMenu} right>
                <DropdownItem className={classes.dropdownItem}>
                  <Link className={classes.link} to="/updateInfo">
                    Update User Info
                  </Link>
                </DropdownItem>
                <DropdownItem className={classes.dropdownItem}>
                  <Link className={classes.link} to="/fitbit">
                    Link Fitbit
                  </Link>
                </DropdownItem>
                <DropdownItem className={classes.dropdownItem}>
                  <NavbarText
                    className={classes.navbarText}
                    onClick={props.clearLogin}
                  >
                    Logout
                  </NavbarText>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>

      <div className="Header-route">
        <Switch>
          <Route exact path="/">
            {props.isCoach ? (
              <CoachLanding token={props.token} />
            ) : (
              <AthleteLanding token={props.token} />
            )}
          </Route>
          <Route exact path="/athlete">
            <AthleteLanding token={props.token} />
          </Route>
          <Route exact path="/clubs">
            <ClubLanding token={props.token} />
          </Route>
          <Route exact path="/fitbit">
            <FitbitAuth token={props.token} />
          </Route>
          <Route exact path="/garmin">
            <GarminAuth token={props.token} />
          </Route>
          <Route exact path="/coach">
            <CoachLanding token={props.token} />
          </Route>
          <Route exact path="/updateInfo">
            <UpdateInfoLanding
              token={props.token}
              clearLogin={props.clearLogin}
            />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Header;
