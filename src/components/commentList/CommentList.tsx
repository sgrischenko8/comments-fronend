import { CommentComponent } from './comment/Comment';
import { Comment } from '../../models/Comment';

interface CommentListProps {
  comments?: Comment[];
  setComments: (arg0: Comment[]) => void;
}

export const CommentList = ({ comments, setComments }: CommentListProps) => {
  return (
    <ul className="commentList">
      {comments?.map((comment) => (
        <li key={comment.id}>
          <CommentComponent comment={comment} setComments={setComments} />
        </li>
      ))}
    </ul>
  );
};
