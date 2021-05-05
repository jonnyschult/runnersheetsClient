import APIURL from './environment';
import axios, { AxiosResponse } from 'axios';

const deleter: (token: string, endPoint: string, query?: string) => Promise<AxiosResponse> = async (
  token,
  endPoint,
  query
) => {
  try {
    const results = await axios({
      url: `${APIURL}/${endPoint}${query ? `?${query}` : ''}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return results;
  } catch (error) {
    throw error;
  }
};

export default deleter;
