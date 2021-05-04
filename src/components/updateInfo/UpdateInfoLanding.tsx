import React, { useState } from "react";
import classes from "./UpdateInfo.module.css";
import UpdateUserInfo from "./UpdateUserInfo";
import UpdatePassword from "./UpdatePassword";
import DeleteUser from "./DeleteUser";
import Image from "../../Assets/pexels-pixabay-221210.jpg";
import { Container } from "reactstrap";
import { UserInfo } from "../../models";

interface UpdateInfoLandingProps {
  userInfo: UserInfo;
  logoutHandler: () => void;
}

const UpdateInfoLanding: React.FC<UpdateInfoLandingProps> = (props) => {
  const [deleteUser, setDeleteUser] = useState<boolean>(false);
  const [updatePassword, setUpdatePassword] = useState<boolean>(false);
  const [updateUserInfo, setUpdateUserInfo] = useState<boolean>(true);

  const selectDelete = () => {
    setUpdatePassword(false);
    setUpdateUserInfo(false);
    setDeleteUser(true);
  };
  const selectInfo = () => {
    setUpdatePassword(false);
    setDeleteUser(false);
    setUpdateUserInfo(true);
  };
  const selectPassword = () => {
    setUpdateUserInfo(false);
    setDeleteUser(false);
    setUpdatePassword(true);
  };
  return (
    <div className={classes.wrapper}>
      <div className={classes.containerDiv}>
        <Container className={classes.leftContainer}>
          <img className={classes.img} src={Image} alt="" />
        </Container>
        <Container className={classes.rightContainer}>
          <div className={classes.menu}>
            <p className={classes.menuOption} onClick={(e) => selectInfo()}>
              Update Info
            </p>
            <p className={classes.menuOption} onClick={(e) => selectPassword()}>
              Update Password
            </p>
            <p className={classes.menuOption} onClick={(e) => selectDelete()}>
              Delete Account
            </p>
          </div>
          {updateUserInfo ? (
            <UpdateUserInfo userInfo={props.userInfo} />
          ) : (
            <></>
          )}
          {updatePassword ? (
            <UpdatePassword userInfo={props.userInfo} />
          ) : (
            <></>
          )}
          {deleteUser ? (
            <DeleteUser
              userInfo={props.userInfo}
              logoutHandler={props.logoutHandler}
            />
          ) : (
            <></>
          )}
        </Container>
      </div>
    </div>
  );
};

export default UpdateInfoLanding;
