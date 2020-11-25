import React from "react";
import RegisterModal from "./RegisterModal";

const Splash = (props) => {
  return (
    <div>
      <RegisterModal
        updateToken={props.updateToken}
        updateIsCoach={props.updateIsCoach}
      />
    </div>
  );
};

export default Splash;
