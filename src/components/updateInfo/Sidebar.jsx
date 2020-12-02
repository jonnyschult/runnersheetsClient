import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import UpdateUserInfo from "./UpdateUserInfo";
import UpdatePassword from "./UpdatePassword";
import DeleteUser from "./DeleteUser";

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <div className="sidebar-list-styling">
        <ul className="sidebar-list  list-unstyled">
          <li>
            <Link to="/updateUserInfo">Update Info</Link>
          </li>
          <li>
            <Link to="/updatePassword">Update Password</Link>
          </li>
          <li>
            <Link to="/deleteUser">Delete Account</Link>
          </li>
        </ul>
      </div>
      <div className="componentContainer">
        <Switch>
          <Route exact path="/updateUserInfo">
            <UpdateUserInfo
              token={props.token}
              user={props.user}
              setUpdate={props.setUpdate}
            />
          </Route>
          <Route exact path="/updatePassword">
            <UpdatePassword
              token={props.token}
              user={props.user}
              setUpdate={props.setUpdate}
            />
          </Route>
          <Route exact path="/">
            <UpdateUserInfo
              token={props.token}
              user={props.user}
              setUpdate={props.setUpdate}
            />
          </Route>
          <Route exact path="/deleteUser">
            <DeleteUser
              token={props.token}
              user={props.user}
              setUpdate={props.setUpdate}
              clearLogin={props.clearLogin}
            />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Sidebar;
