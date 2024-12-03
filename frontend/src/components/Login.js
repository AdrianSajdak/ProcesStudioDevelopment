import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/login/', credentials)
      .then(response => {
        console.log(response.data);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        // Przekieruj lub zaktualizuj stan aplikacji
      })
      .catch(error => {
        if (error.response) {
          setErrors(error.response.data);
        }
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Nazwa użytkownika" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Hasło" onChange={handleChange} required />
      <button type="submit">Zaloguj się</button>
      {errors && <div>{JSON.stringify(errors)}</div>}
    </form>
  );
}

export default Login;
