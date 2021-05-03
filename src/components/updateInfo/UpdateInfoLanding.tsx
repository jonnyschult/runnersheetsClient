import React, { useState, useEffect } from "react";
import APIURL from "../../utilities/environment";
import classes from "./UpdateInfo.module.css";
import UpdateUserInfo from "./UpdateUserInfo";
import UpdatePassword from "./UpdatePassword";
import DeleteUser from "./DeleteUser";
import Image from "../../Assets/pexels-pixabay-221210.jpg";
import { Container, Spinner } from "reactstrap";

const UpdateInfoLanding = (props) => {
  const [loadingMain, setLoadingMain] = useState(true);
  const [user, setUser] = useState();
  const [update, setUpdate] = useState();
  const [err, setErr] = useState();
  const [deleteUser, setDeleteUser] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [updateUserInfo, setUpdateUserInfo] = useState(true);

  /********************
    GET USER
  ********************/
  useEffect(() => {
    fetch(`${APIURL}/user/getAthlete`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        await setUser(data.athlete);
        setLoadingMain(false);
      })
      .catch((err) => {
        setLoadingMain(false);
        setErr("Something went Wrong");
      });
  }, [update]);

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
      {loadingMain ? (
        <Spinner></Spinner>
      ) : (
        <div className={classes.containerDiv}>
          <Container className={classes.leftContainer}>
            <img className={classes.img} src={Image} alt="" />
          </Container>
          <Container className={classes.rightContainer}>
            <div className={classes.menu}>
              <p className={classes.menuOption} onClick={(e) => selectInfo()}>
                Update Info
              </p>
              <p
                className={classes.menuOption}
                onClick={(e) => selectPassword()}
              >
                Update Password
              </p>
              <p className={classes.menuOption} onClick={(e) => selectDelete()}>
                Delete Account
              </p>
            </div>
            {updateUserInfo ? (
              <UpdateUserInfo
                token={props.token}
                user={user}
                setUpdate={setUpdate}
              />
            ) : (
              <></>
            )}
            {updatePassword ? (
              <UpdatePassword
                token={props.token}
                user={user}
                setUpdate={setUpdate}
              />
            ) : (
              <></>
            )}
            {deleteUser ? (
              <DeleteUser
                token={props.token}
                user={user}
                clearLogin={props.clearLogin}
              />
            ) : (
              <></>
            )}
          </Container>
        </div>
      )}
    </div>
  );
};

export default UpdateInfoLanding;
