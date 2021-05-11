import { Activity } from "../models";

const avgHRAdder = (arr: Activity[]) => {
  let totalNum = 0;
  let counter = 0;
  arr.forEach((run) => {
    if (typeof run.avg_hr === "number") totalNum += run.avg_hr;
    counter++;
  });
  return totalNum / counter;
};

export default avgHRAdder;
