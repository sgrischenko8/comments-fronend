import axios from 'axios';

axios.defaults.withCredentials = true;

axios.defaults.baseURL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_BASE_URL : 'http://localhost:3000/';

export const fetchComments = async (params) => {
  // const params = {
  //   page,
  //   sortBy,
  //   sortOrder,
  // };
  try {
    const response = await axios.get('/comments/', { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const postComment = async (body) => {
  try {
    const response = await axios.post(`/comments/`, body);
    console.log(response.data);
    return response;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

export const getCaptcha = async () => {
  try {
    const response = await axios.get(`/captcha/`);
    return response;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};
