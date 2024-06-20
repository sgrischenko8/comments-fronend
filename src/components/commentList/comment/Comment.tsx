import { useState } from 'react';
import { CommentList } from '../CommentList';
import { CommentType } from '../../../@types/custom';

interface CommentProps {
  comment: CommentType;
}

export const Comment = ({ comment }: CommentProps) => {
  const { createdAt, userName, text, children } = comment;

  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="comment">
      <span>
        <strong>{userName}</strong> {createdAt}
      </span>
      <button
        type="button"
        title="Reply"
        onClick={() => setShowReplyForm(!showReplyForm)}
      >
        {showReplyForm ? 'Cancel' : 'Reply'}
      </button>
      <p dangerouslySetInnerHTML={{ __html: text }}></p>

      {comment?.children && <CommentList comments={children} />}
    </div>
  );
};
