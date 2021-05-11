import { Activity } from "../models";

const elevationAdder = (arr: Activity[]) => {
  let totalNum = 0;
  let counter = 0;
  arr.forEach((run) => {
    if (typeof run.elevation_meters === "number")
      totalNum += run.elevation_meters;
    counter++;
  });
  return { total: totalNum, average: totalNum / counter };
};

export default elevationAdder;
