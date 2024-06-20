import { useState } from 'react';

import { Comment } from '../commentList/comment/Comment';

interface CommentFormProps {
  parentId: null | number;
  close: () => void;
}

export const CommentForm = ({ parentId, close }: CommentFormProps) => {
  const {
    userName: savedName,
    email: savedEmail,
    homePage,
  } = JSON.parse(localStorage.getItem('user') as string);

  const [userName, setUserName] = useState<string>(savedName);
  const [email, setEmail] = useState<string>(savedEmail);
  const [url, setUrl] = useState<string>(homePage);
  const [text, setText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form id="commentForm" onSubmit={handleSubmit}>
      <button className="closeBtn" title="Close form" onClick={() => close()}>
        x
      </button>
      <fieldset>
        <legend>Credentials</legend>
        <input
          type="text"
          placeholder="User Name"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          pattern="^[a-zA-Z0-9]+$"
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="Your Home Page"
          name="homePage"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </fieldset>
      <div>
        <textarea
          placeholder="Leave comment"
          name="comment"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          required
        />
      </div>

      <div className="formFooter">
        <button
          type="button"
          onClick={() => {
            setShowPreview(!showPreview);
          }}
        >
          {showPreview ? 'Hide' : 'Preview'}
        </button>
        <button type="submit">Post</button>
      </div>
      {showPreview && (
        <div>
          <h3>Comment preview</h3>
          <Comment
            comment={{
              createdAt: Date.now(),
              email,
              parentId,
              text,
              userName,
            }}
          />
        </div>
      )}
    </form>
  );
};
