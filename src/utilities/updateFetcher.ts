import APIURL from "./environment";
import {
  User,
  PasswordUpdate,
  Club,
  Team,
  TeamsUsers,
  ClubsUsers,
  Activity,
} from "../models";
import axios, { AxiosResponse } from "axios";

type Info =
  | User
  | Activity
  | Comment
  | PasswordUpdate
  | Team
  | Club
  | TeamsUsers
  | ClubsUsers
  | { fitbit_refresh: number | string }
  | { strava_refresh: number | string };

const updater: (
  token: string,
  endPoint: string,
  info: Info
) => Promise<AxiosResponse> = async (token, endPoint, info) => {
  try {
    const results = await axios({
      url: `${APIURL}/${endPoint}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: {
        info,
      },
    });
    return results;
  } catch (error) {
    throw error;
  }
};

export default updater;
