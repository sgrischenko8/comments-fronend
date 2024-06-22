import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CommentForm } from './components/commentForm/CommentForm';
import { CommentList } from './components/commentList/CommentList';
import { Modal } from './components/modal/Modal';
import { Paginator } from './components/paginator/Paginator';
import { Loader } from './components/loader/Loader';
import { CredentialForm } from './components/credentialForm/CredentialForm';
import { User } from './models/User';
import { Comment } from './models/Comment';
import { fetchAllComments } from './api/CommentService';

function App() {
  let savedUser: User | undefined;

  if (localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user') as string);
    savedUser = new User(
      userData.userName,
      userData.email,
      userData.homePage,
      userData.id,
    );
  }
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');

  const params = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );

  const [user, setUser] = useState<User | undefined>(savedUser);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState<number>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isAscOrder = params?.sortOrder === 'ASC';

  async function fetchComments() {
    setIsLoading(true);
    try {
      const response = await fetchAllComments(params);
      setError(
        response?.status === 500 ? 'We have server connection error' : '',
      );
      setComments(response.comments);
      setTotal(response.totalPages);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [params]);

  function onSubmit(data: User) {
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
      {isLoading && <Loader />}
      {user?.email ? (
        <section className="App">
          <ul className="disclaimer">
            <li>Users allowed to add only .txt, .jpg, .gif, .png files.</li>
            <li>
              Please use only tags provided by tag panel. The other tags are
              forbidden.
            </li>
            <li>
              User that caught on using dangerous code inside hyperlinks will be
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

            <select
              name="sortBy"
              defaultValue="placeholder"
              onChange={(e) => sortBy(e)}
            >
              <option hidden disabled value="placeholder">
                Sort by...
              </option>
              <option value="userName">Author</option>
              <option value="email">Email</option>
              <option value="createdAt">Date</option>
            </select>

            <button
              type="button"
              onClick={() =>
                changeParams('sortOrder', isAscOrder ? 'DESC' : 'ASC')
              }
              title={`Sort by ${isAscOrder ? 'Descending' : 'Ascending'} order`}
            >
              {isAscOrder ? '⇓' : '⇑'}
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
        <Modal onClose={() => setShowModal(false)}>
          <></>
          <CredentialForm onSubmit={onSubmit} />
        </Modal>
      )}
    </>
  );
}

export default App;
