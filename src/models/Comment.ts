import { CommentType } from '../@types/custom';

export class Comment {
  id?: number;
  createdAt: number;
  email: string;
  parentId: number | null;
  text: string;
  userName: string;
  replies?: Comment[];
  file: string | File | null;
  image: string | File | null;

  constructor(
    createdAt: number,
    email: string,
    text: string,
    userName: string,
    parentId: number | null = null,
    id?: number,
    replies?: Comment[],
    file: string | File | null = null,
    image: string | File | null = null,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.email = email;
    this.parentId = parentId;
    this.text = text;
    this.userName = userName;
    this.replies = replies;
    this.file = file;
    this.image = image;
  }

  static fromCommentType(commentType: CommentType): Comment {
    return new Comment(
      commentType.createdAt,
      commentType.email,
      commentType.text,
      commentType.userName,
      commentType.parentId,
      commentType.id,
      commentType.replies?.map(Comment.fromCommentType),
      commentType.file,
      commentType.image,
    );
  }
}
