import { ChangeEvent, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postComment } from '../../api/api';
import { Comment } from '../commentList/comment/Comment';
// import { CommentType } from '@types/custom';

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

  const [searchParams] = useSearchParams();
  const params = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );

  const [userName, setUserName] = useState<string>(savedName);
  const [email, setEmail] = useState<string>(savedEmail);
  const [url, setUrl] = useState<string>(homePage);
  const [text, setText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [textFile, setTextFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const allowedFormat = ['jpeg', 'gif', 'png'];

  async function addComment() {
    const formData = new FormData();
    formData.append('file', textFile as File);
    formData.append('image', imageFile as File);
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('homePage', homePage);
    formData.append('text', text);
    if (parentId) {
      formData.append('parentId', parentId as unknown as string);
    }
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    try {
      const resp = await postComment(formData);
      console.log(resp);

      if (resp?.status < 400) {
        setText('');
        close();
      }
      if (resp.data?.error) {
        setError(resp.data.error);
      }
      // return true;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addComment();
  }

  async function addFile(e: ChangeEvent<HTMLInputElement>, type: string) {
    const file = e.target.files?.[0] || null;
    if (!file) {
      return;
    }
    // console.log(file);

    if (type === 'textFile') {
      if (
        file.type === 'text/plain' &&
        file.name.slice(-4).toLowerCase() === '.txt'
      ) {
        // check if file weight more that 100 kb (100*1024b)
        if (file.size > 100 * 1024) {
          setError('Text file not allow to be bigger that 100kb. ');
          return;
        }
        setTextFile(file);
        setError('');
        return;
      }
      setError('You allowed upload only .txt file. ');
    }

    if (type === 'imageFile' && file.type.startsWith('image/')) {
      // check if image has type .jpg, .gif, .png
      if (allowedFormat.some((el) => file.type.includes(el))) {
        setImageFile(file);
        setError('');
        return;
      }
    }
    setError('Only .jpg, .gif, .png files allowed. ');
  }

  function deleteFile(type: 'textFile' | 'imageFile') {
    if (type === 'textFile') {
      setTextFile(null);
    } else {
      setImageFile(null);
    }
  }

  function getType(i: 0 | 1) {
    return i === 0 ? 'textFile' : 'imageFile';
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
      {error && (
        <p className="error">
          {typeof error === 'string' ? error : 'Error happen'}
        </p>
      )}
      {[textFile, imageFile].map((el, i) => (
        <div key={i} className="custom-file-upload">
          {el ? (
            <span>{el.name}</span>
          ) : (
            <label>
              <input
                type="file"
                title="Add file"
                name={getType(i as 1 | 0)}
                accept={i === 0 ? 'text/plain' : 'image/*'}
                onChange={(e) => addFile(e, getType(i as 0 | 1))}
              />
              Add {i === 0 ? 'text' : 'image'} file
            </label>
          )}

          <button
            type="button"
            title="Delete file"
            onClick={() => deleteFile(getType(i as 0 | 1))}
          >
            x
          </button>
        </div>
      ))}
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
        <div className="comment commentPreview">
          <h3>Comment preview</h3>
          <Comment
            comment={{
              createdAt: Date.now(),
              email,
              file: textFile,
              image: imageFile,
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
