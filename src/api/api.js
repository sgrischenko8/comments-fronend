import axios from 'axios';

axios.defaults.withCredentials = true;

axios.defaults.baseURL = import.meta.env.PROD
  ? 'https://stark-dawn-12728-fe14e70c36ad.herokuapp.com/'
  : 'http://localhost:3000/';

export const fetchComments = async (params) => {
  // const params = {
  //   page,
  //   sortBy,
  //   sortOrder,
  // };
  try {
    const response = await axios.get(
      '/comments/',
      { params },
      {
        withCredentials: true,
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const postComment = async (body) => {
  try {
    const response = await axios.post(`/comments/`, body, {
      withCredentials: true,
    });
    console.log(response.data);
    return response;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

export const getCaptcha = async () => {
  try {
    const response = await axios.get(`/captcha/`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};
