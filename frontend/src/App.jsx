import { useState } from 'react';
import './App.css';

function App() {
  const [createUserNameInput, setCreateUserNameInput] = useState();
  const [createPasswordInput, setCreatePasswordInput] = useState();
  const [createEmailInput, setCreateEmailInput] = useState();
  const [createMoneyInput, setCreateMoneyInput] = useState();
  const [loginUserNameInput, setLoginUserNameInput] = useState();
  const [loginPasswordInput, setLoginPasswordInput] = useState();
  const [token, setToken] = useState();

  return (
    <div className='App'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const user = {
            username: createUserNameInput,
            password: createPasswordInput,
            email: createEmailInput,
            money: createMoneyInput,
          };

          fetch('http://localhost:3000/users', {
            method: 'POST',
            mode: 'cors',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(user),
          });
          console.log('gddg');
        }}
      >
        <label htmlFor='createUserNameInput'>Username</label>
        <input
          type='text'
          id='createUserNameInput'
          name='createUserNameInput'
          value={createUserNameInput}
          onChange={(e) => setCreateUserNameInput(e.target.value)}
        />
        <label htmlFor='createPasswordInput'>Password</label>
        <input
          type='password'
          id='createPasswordInput'
          name='createPasswordInput'
          value={createPasswordInput}
          onChange={(e) => setCreatePasswordInput(e.target.value)}
        />
        <label htmlFor='createEmailInput'>Email</label>
        <input
          type='email'
          id='createEmailInput'
          name='createEmailInput'
          value={createEmailInput}
          onChange={(e) => setCreateEmailInput(e.target.value)}
        />
        <label htmlFor='createMoneyInput'>Money</label>
        <input
          type='number'
          id='createMoneyInput'
          name='createMoneyInput'
          value={createMoneyInput}
          onChange={(e) => setCreateMoneyInput(e.target.value)}
        />

        <button type='submit'>Create</button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('e');
          const user = {
            username: loginUserNameInput,
            password: loginPasswordInput,
          };

          fetch('http://localhost:3000/sessions', {
            method: 'POST',
            mode: 'cors',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(user),
          })
            .then((res) => res.text())
            .then((data) => {
              setToken(data);
            });
        }}
      >
        <label htmlFor='loginUserNameInput'>Username</label>
        <input
          type='text'
          id='loginUserNameInput'
          name='loginUserNameInput'
          value={loginUserNameInput}
          onChange={(e) => setLoginUserNameInput(e.target.value)}
        />
        <label htmlFor='loginPasswordInput'>Password</label>
        <input
          type='password'
          id='loginPasswordInput'
          name='loginPasswordInput'
          value={loginPasswordInput}
          onChange={(e) => setLoginPasswordInput(e.target.value)}
        />

        <button type='submit'>Login</button>
      </form>
      <button
        onClick={() => {
          fetch('http://localhost:3000/me/accounts', {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
            .then((response) => response.text())
            .then((data) => alert('Account balance: ' + data));
        }}
      >
        Check account balance
      </button>
    </div>
  );
}

export default App;
