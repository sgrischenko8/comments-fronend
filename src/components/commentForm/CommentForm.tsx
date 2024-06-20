import { ChangeEvent, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Comment } from '../commentList/comment/Comment';
import { postComment } from '../../api/api';
import { CommentType } from '@types/custom';

interface CommentFormProps {
  setComments: (arg0: CommentType[]) => void;
  parentId: null | number;
  close: () => void;
}

export const CommentForm = ({
  setComments,
  parentId,
  close,
}: CommentFormProps) => {
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

  const ws = useRef<WebSocket | null>(null);

  const [userName, setUserName] = useState<string>(savedName);
  const [email, setEmail] = useState<string>(savedEmail);
  const [url, setUrl] = useState<string>(homePage);
  const [text, setText] = useState('');
  const [textPreview, setTextPreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showHypelink, setShowHypelink] = useState(false);
  const [error, setError] = useState('');
  const [textFile, setTextFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const allowedTags = ['i', 'strong', 'code', 'a'] as const;
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
        setComments(resp?.data?.comments);
      }
      if (resp.data?.error) {
        setError(resp.data.error);
      }
      // return true;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  useEffect(() => {
    // Initialize WebSocket connection when the component mounts
    if (!ws.current) {
      ws.current = new WebSocket('ws://localhost:8080');

      ws.current.onopen = () => {
        console.log('Connected to the WebSocket server');
      };

      ws.current.onmessage = (event) => {
        const message = event.data; // Assuming the server sends JSON messages
        console.log(message);
        setTextPreview(message);
        if (message.type === 'new-comment') {
          console.log(message);
        }
      };

      ws.current.onclose = () => {
        console.log('Disconnected from the WebSocket server');
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }

    // Cleanup function to close WebSocket when the component unmounts
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log('close');
        ws.current.close();
      }
    };
  }, []); // Depend on params to re-run the effect if params change

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addComment();
  }

  function addTag(
    tag: (typeof allowedTags)[number],
    href?: string,
    title?: string,
  ) {
    let payload = '';
    if (href && title) {
      payload = ` href="${href}" title="${title}"`;
    }
    setText(
      text + `<${tag}` + payload + '>' + `${title ? title : ''}` + `</${tag}>`,
    );
  }

  function hyperlinkSubmit() {
    const { value: title } = document.getElementById(
      'linkTitle',
    ) as HTMLInputElement;
    const { value: url } = document.getElementById(
      'linkUrl',
    ) as HTMLInputElement;

    if (title && url) {
      addTag('a', url, title);
      setError('');
    } else {
      setError('Fill title and link fields');
      return;
    }
    setShowHypelink(false);
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

  function previewHandler() {
    ws.current?.send(text);
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
            if (showPreview) {
              ws.current?.send(e.target.value);
            }
            setText(e.target.value);
          }}
          required
        />
        <ul className="tags">
          {allowedTags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                title={`Add <${tag}> tag`}
                onClick={() =>
                  tag === 'a' ? setShowHypelink(true) : addTag(tag)
                }
              >{`[${tag}]`}</button>
            </li>
          ))}
        </ul>
        {showHypelink && (
          <div className="hyperlinkForm">
            <label>
              title
              <input id="linkTitle" type="text" name="title" />
            </label>
            <label>
              link
              <input id="linkUrl" type="url" name="link" />
            </label>
            <button
              type="button"
              title="Add hyperlink"
              onClick={() => hyperlinkSubmit()}
            >
              ok
            </button>{' '}
            <button
              type="button"
              title="Cancel"
              onClick={() => setShowHypelink(false)}
            >
              x
            </button>
          </div>
        )}
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
        <p className="error">No CAPTCHA. Try to reload page</p>

        <button
          type="button"
          onClick={() => {
            previewHandler();
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
              text: textPreview,
              userName,
            }}
          />
        </div>
      )}
    </form>
  );
};
