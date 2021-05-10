import { UserInfo, User, Team, Club, Activity } from "../models";
import getter from "./getFetcher";

const userDataFetcher: (
  token: string,
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
) => Promise<UserInfo> = async (token, setUserInfo) => {
  try {
    const userData = await getter(token, "users/getUser");

    return {
      loggedIn: true,
      user: userData.data.user,
      teams: userData.data.teams,
      clubs: userData.data.clubs,
      activities: userData.data.activities,
      setUserInfo: setUserInfo,
      token: token,
    };
  } catch (error) {
    console.log(error);
    return {
      loggedIn: false,
      user: {
        email: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        premium_user: false,
        coach: false,
      },
      teams: [],
      clubs: [],
      activities: [],
      token: "",
    };
  }
};

export default userDataFetcher;
