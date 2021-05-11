import { Activity } from "../models";

const metersAdder = (arr: Activity[]) => {
  let totalNum = 0;
  arr.forEach((run) => (totalNum += run.distance_meters));
  return totalNum;
};

export default metersAdder;
