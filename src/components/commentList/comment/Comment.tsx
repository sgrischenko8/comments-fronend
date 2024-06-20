import { useState } from 'react';
import { CommentForm } from '../../commentForm/CommentForm';
import { CommentList } from '../CommentList';
import { CommentType } from '../../../@types/custom';

interface CommentProps {
  comment: CommentType;
}

export const Comment = ({ comment }: CommentProps) => {
  const {
    id,
    createdAt,
    userName,
    text,
    children,
    file = null,
    image = null,
  } = comment;

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
      {image && <img src={''} alt="image" id="image" width={64} height={48} />}
      {file && (
        <>
          <a
            href={`${import.meta.env.VITE_SERVER_URL}/${image}`}
            download={file?.slice(22) as string}
            title="Download text file"
          >
            {file?.slice(22) as string}
          </a>
          <button type="button" onClick={() => false}>
            Show
          </button>
        </>
      )}

      {comment?.children && <CommentList comments={children} />}
      {showReplyForm && (
        <CommentForm
          parentId={id as number}
          close={() => setShowReplyForm(false)}
        />
      )}
    </div>
  );
};
