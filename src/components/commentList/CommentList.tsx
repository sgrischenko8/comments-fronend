import { Comment } from './comment/Comment';
import { CommentType } from '../../@types/custom';

interface CommentListProps {
  comments?: CommentType[];
  setComments: (arg0: CommentType[]) => void;
}

export const CommentList = ({ comments, setComments }: CommentListProps) => {
  return (
    <ul className="commentList">
      {comments?.map((comment) => (
        <li key={comment.id}>
          <Comment comment={comment} setComments={setComments} />
        </li>
      ))}
    </ul>
  );
};
