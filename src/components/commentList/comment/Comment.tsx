import { useState } from 'react';
import { CommentForm } from '../../commentForm/CommentForm';
import { CommentList } from '../CommentList';
import { Modal } from '../../../components/modal/Modal';
import { getFormatedDate } from '../../../utils/getFormatedDate';
import { CommentType } from '../../../@types/custom';

interface CommentProps {
  comment: CommentType;
  setComments?: (arg0: CommentType[]) => void;
}

export const Comment = ({ comment, setComments }: CommentProps) => {
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
  const [showFileModal, setShowFileModal] = useState(false);
  const [showImageModal, setImageShowModal] = useState(false);
  const [fileContent, setFileContent] = useState('');

  let imgPath = '';
  if (image) {
    imgPath = setComments
      ? `https://stark-dawn-12728-fe14e70c36ad.herokuapp.com/${image}`
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
      return `https://stark-dawn-12728-fe14e70c36ad.herokuapp.com/${file}`;
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
      setFileContent(textContent);
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
        title="Reply"
        onClick={() => (setComments ? setShowReplyForm(!showReplyForm) : false)}
      >
        {showReplyForm ? 'Cancel' : 'Reply'}
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
            Show
          </button>
        </>
      )}
      {comment?.children && (
        <CommentList
          comments={children}
          setComments={setComments as (arg0: CommentType[]) => void}
        />
      )}

      {showReplyForm && (
        <CommentForm
          setComments={setComments as (arg0: CommentType[]) => void}
          parentId={id as number}
          close={() => setShowReplyForm(false)}
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
