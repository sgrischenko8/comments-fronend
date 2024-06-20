import { useState } from 'react';
import { UserType } from '../../@types/custom';

interface CredentialFormProps {
  onSubmit: (data: UserType) => void;
  short?: boolean;
}

export const CredentialForm = ({ onSubmit }: CredentialFormProps) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (userName.trim() && email.trim()) {
      onSubmit({
        userName: (form[0] as HTMLInputElement).value,
        email: (form[1] as HTMLInputElement).value,
        homePage: (form[2] as HTMLInputElement).value,
      });
    }
  }

  return (
    <form id="credentialForm" onSubmit={submitHandler}>
      <label>
        Name:
        <input
          type="text"
          placeholder="User Name"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          pattern="^[a-zA-Z0-9]+$"
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          placeholder="E-mail"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Home Page:
        <input
          type="url"
          placeholder="Your Home Page"
          name="homePage"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
      <button type="submit" onClick={() => false}>
        Login
      </button>
    </form>
  );
};
