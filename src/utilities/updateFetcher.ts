import APIURL from "./environment";
import {
  User,
  PasswordUpdate,
  Club,
  Team,
  TeamsUsers,
  ClubsUsers,
} from "../models";
import axios, { AxiosResponse } from "axios";

type Info =
  | User
  | Comment
  | PasswordUpdate
  | Team
  | Club
  | TeamsUsers
  | ClubsUsers;

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
