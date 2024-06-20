import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CommentList } from './components/commentList/CommentList';
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

  const [user, setUser] = useState(savedUser);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [total, setTotal] = useState<number>();
  const [error, setError] = useState('');

  let isAscOrder = params?.sortOrder === 'ASC';

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
          <div className="toolbar">
            <button type="button" title="Add Comment">
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
            </div>{' '}
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

          {error && <p className="error commentList">{error}</p>}
          {comments?.length > 0 && (
            <>
              <CommentList comments={comments} />
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
