import React, { useState } from "react";
import classes from "./HeaderFooter.module.css";
import { Link } from "react-router-dom";
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

interface HeaderProps {
  logoutHandler: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
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
                  <Link className={classes.link} to="/strava">
                    Link Strava
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
                    onClick={props.logoutHandler}
                  >
                    Logout
                  </NavbarText>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
