import { fetchComments, postComment, getCaptcha } from './api';

type ParamsType = { [k: string]: string };
export const fetchAllComments = async (params: ParamsType) => {
  return await fetchComments(params);
};

export const createComment = async (body: FormData) => {
  return await postComment(body);
};

export const fetchCaptcha = async () => {
  return await getCaptcha();
};
