import APIURL from './environment';
import {  Login, User, PasswordUpdate } from '../models';
import axios, { AxiosResponse } from 'axios';

type Info =  User | Login | PasswordUpdate


const poster: (token: string, endPoint: string, info: Info, extraInfo?: any) => Promise<AxiosResponse> = async (
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
    return results;
  } catch (error) {
    throw error;
  }
};

export default poster;