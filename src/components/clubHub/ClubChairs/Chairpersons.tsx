import React from "react";
import classes from "../Club.module.css";
import ChairAdderModal from "./ChairAdderModal";
import ChairModal from "./ChairModal";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Club, User, UserInfo } from "../../../models";

interface ChairPersonsProps {
  userInfo: UserInfo;
  chairpersons: User[];
  selectedClub: Club | null;
  setSelectedClub: React.Dispatch<React.SetStateAction<Club | null>>;
  clubs: Club[];
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
  setChairpersons: React.Dispatch<React.SetStateAction<User[]>>;
}

const Chairpersons: React.FC<ChairPersonsProps> = (props) => {
  return (
    <div>
      <Card className={classes.leftContainerCard}>
        <CardBody className={classes.leftContainerCardBody}>
          <CardTitle className={classes.leftContainerCardTitle}>
            Chairperson
          </CardTitle>
          {props.chairpersons.length > 0 ? (
            props.chairpersons.map((chairperson, index) => {
              return (
                <ChairModal
                  key={index}
                  userInfo={props.userInfo}
                  chairperson={chairperson}
                  setChairpersons={props.setChairpersons}
                  chairpersons={props.chairpersons}
                  selectedClub={props.selectedClub}
                  setSelectedClub={props.setSelectedClub}
                  clubs={props.clubs}
                  setClubs={props.setClubs}
                />
              );
            })
          ) : (
            <></>
          )}
        </CardBody>
        <ChairAdderModal
          setChairpersons={props.setChairpersons}
          chairpersons={props.chairpersons}
          selectedClub={props.selectedClub}
          userInfo={props.userInfo}
        />
      </Card>
    </div>
  );
};

export default Chairpersons;
