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
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavbarText>
                <Link to="/coach">Coaches</Link>
              </NavbarText>
            </NavItem>
            <NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Athlete
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <Link to="/athlete">Athlete</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to="/fitbit">Link Fitbit</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to="/garmin">Link Garmin</Link>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
            <NavItem>
              <NavbarText>Plans</NavbarText>
            </NavItem>
          </Nav>
          <Nav>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Settings
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Link to="/updateInfo">Update User Info</Link>
                </DropdownItem>
                <DropdownItem>
                  <NavbarText onClick={props.clearLogin}>Logout</NavbarText>
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
          <Route exact path="/fitbit">
            <FitbitAuth token={props.token} />
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
