import { Activity } from "../models";

const timeAdder = (arr: Activity[]) => {
  let totalNum = 0;
  arr.forEach((run) => (totalNum += run.duration_seconds));
  return totalNum;
};

export default timeAdder;
