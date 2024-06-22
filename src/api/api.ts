import axios from 'axios';

axios.defaults.withCredentials = true;

export const serverUrl = import.meta.env.PROD
  ? 'https://stark-dawn-12728-fe14e70c36ad.herokuapp.com'
  : 'http://localhost:3000';
axios.defaults.baseURL = serverUrl;

type ParamsType = { [k: string]: string };
export const fetchComments = async (params: ParamsType) => {
  try {
    const response = await axios.get('/comments/', { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const postComment = async (body: FormData) => {
  try {
    const response = await axios.post('/comments/', body);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const getCaptcha = async () => {
  try {
    const response = await axios.get('/captcha/');
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};
