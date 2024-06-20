import { Comment } from './comment/Comment';
import { CommentType } from '../../@types/custom';

interface CommentListProps {
  comments?: CommentType[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  return (
    <ul className="commentList">
      {comments?.map((comment) => (
        <li key={comment.id}>
          <Comment comment={comment} />
        </li>
      ))}
    </ul>
  );
};
