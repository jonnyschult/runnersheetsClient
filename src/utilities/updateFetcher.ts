import APIURL from './environment';
import {
  Lesson,
  UsersLesson,
  Assignment,
  UsersAssignment,
  Video,
  User,
  VideoTag,
  Comment,
  Tag,
  PackageOption,
} from '../models';
import axios from 'axios';

type Info =
  | Lesson
  | UsersLesson
  | Assignment
  | UsersAssignment
  | Video
  | User
  | VideoTag
  | Comment
  | Tag
  | PackageOption
  | { password: string; newPassword: string };

const updater: (token: string, endPoint: string, info: Info) => Promise<any> = async (
  token,
  endPoint,
  info
) => {
  try {
    const results = await axios({
      url: `${APIURL}/${endPoint}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: {
        info,
      },
    });
    return results.data;
  } catch (error) {
    throw error;
  }
};

export default updater;
