import APIURL from './environment';
import {
  Login,
User
} from '../models';
import axios from 'axios';

type Info =  User | Login


const poster: (token: string, endPoint: string, info: Info, extraInfo?: any) => Promise<any> = async (
  token,
  endPoint,
  info,
  extraInfo
) => {
  try {
    const results = await axios({
      url: `${APIURL}/${endPoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: {
        info,
        extraInfo,
      },
    });
    return results.data;
  } catch (error) {
    throw error;
  }
};

export default poster;
