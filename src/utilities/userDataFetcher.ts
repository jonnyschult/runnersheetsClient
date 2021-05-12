import { UserInfo, Team, Club } from "../models";
import getter from "./getFetcher";

const userDataFetcher: (
  token: string,
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
) => Promise<UserInfo> = async (token, setUserInfo) => {
  try {
    const userData = await getter(token, "users/getUser");

    const sortedTeams = userData.data.teams.sort((a: Team, b: Team) => {
      if (a.team_name > b.team_name) {
        return 1;
      } else {
        return -1;
      }
    });
    const sortedClubs = userData.data.clubs.sort((a: Club, b: Club) => {
      if (a.club_name > b.club_name) {
        return 1;
      } else {
        return -1;
      }
    });

    return {
      loggedIn: true,
      user: userData.data.user,
      teams: sortedTeams,
      clubs: sortedClubs,
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
