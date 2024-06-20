/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export default content;
}

export type UserType = {
  id?: number;
  userName: string;
  email: string;
  homePage?: string | URL;
};

export type CommentType = {
  createdAt: number;
  email: string;
  id?: number;
  parentId: null | number;
  text: string;
  userName: string;
  children?: CommentType[];
  file?: string | File | null;
  image?: string | File | null;
};
