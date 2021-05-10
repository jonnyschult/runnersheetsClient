import { User, Team, Club, Activity } from "./";

export class UserInfo {
  constructor(
    public loggedIn: boolean,
    public user: User,
    public teams: Team[],
    public clubs: Club[],
    public activities: Activity[],
    public token: string,
    public setUserInfo?: React.Dispatch<React.SetStateAction<UserInfo>>
  ) {}
}
