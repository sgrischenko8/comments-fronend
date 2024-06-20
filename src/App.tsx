import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CommentForm } from './components/commentForm/CommentForm';
import { CommentList } from './components/commentList/CommentList';
import { Modal } from './components/modal/Modal';
import { Paginator } from './components/paginator/Paginator';
import { CredentialForm } from './components/credentialForm/CredentialForm';
import { fetchComments } from './api/api';
import { UserType, CommentType } from './@types/custom';

function App() {
  let savedUser: UserType | undefined;

  if (localStorage.getItem('user')) {
    savedUser = JSON.parse(localStorage.getItem('user') as string);
  }
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');

  const params = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );
  const ws = useRef<WebSocket | null>(null);

  const [user, setUser] = useState(savedUser);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState<number>();
  const [error, setError] = useState('');

  const isAscOrder = params?.sortOrder === 'ASC';

  async function getComments() {
    try {
      const response = await fetchComments(params);

      setError(
        response?.status === 500 ? 'We have server connection error' : '',
      );
      setComments(response.comments);
      setTotal(response.totalPages);
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

  useEffect(() => {
    getComments();
  }, [params]);

  function onSubmit(data: UserType) {
    localStorage.user = JSON.stringify(data);
    setUser(data);
  }

  function changeParams(field: string, value: string | number) {
    const newparams = { ...params, [field]: value as string };

    setSearchParams(newparams);
  }

  function changePage(newPage: number) {
    changeParams('page', newPage);
  }

  function sortBy(e: React.ChangeEvent<HTMLSelectElement>) {
    const target = e.target as HTMLSelectElement;
    const value = target.value;

    const newparams = { ...params, sortBy: value };

    setSearchParams(newparams);
  }

  return (
    <>
      {user?.email ? (
        <section className="App">
          <ul className="disclaimer">
            <li>Users allowed to add only .txt, .jpg, .gif, .png files.</li>
            <li>
              Please use only tags provided by tag panel. The other tags are
              forbidden.
            </li>
            <li>
              User that caught on usung dangerous code inside hyperlinks will be
              banned forever.
            </li>
            <li>
              There are limits to uploading one text file and one image file.
            </li>
          </ul>

          <div className="toolbar">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              title="Add Comment"
            >
              +
            </button>
            <div>
              <select
                name="sortBy"
                defaultValue="placeholder"
                onChange={(e) => sortBy(e)}
              >
                <option hidden disabled value="placeholder">
                  Sort by...
                </option>
                <option value="userName">User Name</option>
                <option value="email">Email</option>
                <option value="createdAt">Date</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() =>
                changeParams('sortOrder', isAscOrder ? 'DESC' : 'ASC')
              }
              title={`Sort by ${isAscOrder ? 'Descending' : 'Ascending'} order`}
            >
              {isAscOrder ? ' latest first' : 'older first'}
            </button>
          </div>

          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <></>
              <CommentForm
                setComments={setComments}
                parentId={null}
                close={() => setShowModal(false)}
              />
            </Modal>
          )}
          {error && <p className="error commentList">{error}</p>}
          {comments?.length > 0 && (
            <>
              <CommentList comments={comments} setComments={setComments} />
              <Paginator
                setCurrentPage={changePage}
                currentPage={page ? +page : 1}
                pageCount={total ? +total : 3}
              />
            </>
          )}
        </section>
      ) : (
        <CredentialForm onSubmit={onSubmit} />
      )}
    </>
  );
}

export default App;
