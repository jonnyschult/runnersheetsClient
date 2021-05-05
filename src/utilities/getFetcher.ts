import APIURL from './environment';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';

const getter: (
  token: string | null,
  endPoint: string,
  query?: string,
  source?: CancelTokenSource
) => Promise<AxiosResponse> = async (token, endPoint, query, source) => {
  try {
    const result = await axios({
      url: `${APIURL}/${endPoint}${query ? `?${query}` : ''}`,
      cancelToken: source?.token,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export default getter;
