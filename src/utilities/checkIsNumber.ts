import React from "react";
const checkNumber = (
  e: React.ChangeEvent<HTMLInputElement>,
  numSetter: React.Dispatch<React.SetStateAction<number>>,
  errorSetter: React.Dispatch<React.SetStateAction<string>>
) => {
  const regEx = new RegExp(/^[0-9]*$/);
  if (regEx.test(e.target.value) && +e.target.value > 0) {
    numSetter(+e.target.value);
  } else {
    e.target.value = e.target.value.substring(0, e.target.value.length - 1);
    errorSetter("Must be a number");
    setTimeout(() => {
      errorSetter("");
    }, 2400);
    return false;
  }
};

export default checkNumber;
