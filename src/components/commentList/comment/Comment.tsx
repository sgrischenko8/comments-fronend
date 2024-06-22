import { useState } from 'react';
import { CommentForm } from '../../commentForm/CommentForm';
import { CommentList } from '../CommentList';
import { Modal } from '../../../components/modal/Modal';
import { getFormatedDate } from '../../../utils/getFormatedDate';
import { Comment } from '../../../models/Comment';
import { serverUrl } from '../../../api/api';

interface CommentProps {
  comment: Comment;
  setComments?: (comments: Comment[]) => void;
}

export const CommentComponent = ({ comment, setComments }: CommentProps) => {
  const { id, createdAt, userName, text, replies, file, image } = comment;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showImageModal, setImageShowModal] = useState(false);
  const [fileContent, setFileContent] = useState('');

  let imgPath = '';
  if (image) {
    imgPath = setComments
      ? `${serverUrl}/${image}`
      : URL.createObjectURL(image as File);
  }

  function getFileDownloadName() {
    if (setComments) {
      return file?.slice(22) as string;
    }
    if (file instanceof File) {
      return file.name;
    }
    return 'download';
  }

  function getFileDownloadUrl() {
    if (setComments) {
      return `${serverUrl}/${file}`;
    }
    return URL.createObjectURL(file as File);
  }

  async function handleShowFile() {
    if (file && setComments) {
      const response = await fetch(getFileDownloadUrl(), {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      const textContent = await response.text();
      setFileContent(response.status === 404 ? 'File missing' : textContent);
      setShowFileModal(true);
    }
  }

  return (
    <div className="comment">
      <span>
        <strong>{userName}</strong> {getFormatedDate(createdAt)}
      </span>
      <button
        type="button"
        title={showReplyForm ? 'Close' : 'Reply'}
        className="replyBtn"
        onClick={() => (setComments ? setShowReplyForm(!showReplyForm) : false)}
      >
        {showReplyForm ? 'x' : 'h'}
      </button>
      <p dangerouslySetInnerHTML={{ __html: text }}></p>
      {image && (
        <img
          src={imgPath}
          alt="image"
          id="image"
          onClick={() => setImageShowModal(!showImageModal)}
          width={64}
          height={48}
          loading="lazy"
        />
      )}
      {file && (
        <>
          <a
            href={getFileDownloadUrl()}
            download={getFileDownloadName()}
            title="Download text file"
          >
            {getFileDownloadName()}
          </a>
          <button type="button" onClick={handleShowFile} title="Show file">
            <svg width={32} height={22}>
              <use href="sprite.svg#show" />
            </svg>
          </button>
        </>
      )}

      {showReplyForm && (
        <CommentForm
          setComments={setComments as (comments: Comment[]) => void}
          parentId={id as number}
          close={() => setShowReplyForm(false)}
        />
      )}
      {comment?.replies && comment.replies.length > 0 && (
        <CommentList
          comments={replies}
          setComments={setComments as (comments: Comment[]) => void}
        />
      )}

      {showFileModal && (
        <Modal onClose={() => setShowFileModal(false)}>
          <></>
          <pre className="textModal">{fileContent}</pre>
        </Modal>
      )}
      {showImageModal && (
        <Modal onClose={() => setImageShowModal(false)}>
          <></>
          <img
            className="modalImage"
            src={imgPath}
            alt="Image"
            width={320}
            height={240}
          />
        </Modal>
      )}
    </div>
  );
};
