import { Activity } from "../models";

const maxHRAdder = (arr: Activity[]) => {
  let totalNum = 0;
  let counter = 0;
  arr.forEach((run) => {
    if (typeof run.max_hr === "number") {
      totalNum += run.max_hr;
      counter++;
    }
  });
  return totalNum / counter;
};

export default maxHRAdder;
