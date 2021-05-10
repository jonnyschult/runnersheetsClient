import React from "react";
import classes from "../Coach.module.css";
import CoachAdderModal from "./CoachAdderModal";
import StaffModal from "./StaffModal";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Team, User, UserInfo } from "../../../models";

interface TeamStaffProps {
  userInfo: UserInfo;
  staff: User[];
  selectedTeam: Team;
  setStaff: React.Dispatch<React.SetStateAction<User[]>>;
}

const TeamStaff: React.FC<TeamStaffProps> = (props) => {
  return (
    <div>
      <Card className={classes.leftContainerCard}>
        <CardBody className={classes.leftContainerCardBody}>
          <CardTitle className={classes.leftContainerCardTitle}>
            Staff
          </CardTitle>
          {props.staff.length > 0 ? (
            props.staff.map((staffer, index) => {
              return (
                <StaffModal
                  key={index}
                  staffer={staffer}
                  selectedTeam={props.selectedTeam}
                  userInfo={props.userInfo}
                  staff={props.staff}
                  setStaff={props.setStaff}
                />
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <CoachAdderModal
          staff={props.staff}
          setStaff={props.setStaff}
          selectedTeam={props.selectedTeam}
          userInfo={props.userInfo}
        />
      </Card>
    </div>
  );
};

export default TeamStaff;
