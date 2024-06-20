import { useState, useEffect } from 'react';

import { CommentList } from './components/commentList/CommentList';

import { CredentialForm } from './components/credentialForm/CredentialForm';
import { fetchComments } from './api/api';
import { UserType, CommentType } from './@types/custom';

function App() {
  let savedUser: UserType | undefined;

  if (localStorage.getItem('user')) {
    savedUser = JSON.parse(localStorage.getItem('user') as string);
  }

  const [user, setUser] = useState(savedUser);

  const [comments, setComments] = useState<CommentType[]>([]);

  async function getComments() {
    try {
      const response = await fetchComments();

      setComments(response.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  useEffect(() => {
    getComments();
  }, []);

  function onSubmit(data: UserType) {
    localStorage.user = JSON.stringify(data);
    setUser(data);
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
              <select name="sortBy">
                <option hidden disabled value="placeholder">
                  Sort by...
                </option>
                <option value="userName">User Name</option>
                <option value="email">Email</option>
                <option value="createdAt">Date</option>
              </select>
            </div>
          </div>

          {comments?.length > 0 && (
            <>
              <CommentList comments={comments} />
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
