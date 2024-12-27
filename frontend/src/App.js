import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import NavBar from './components/NavBar';
import WymiarowanieZbrojenia from './components/WymiarowanieZbrojenia';
import Projects from './components/Projects';
import Login from './components/Login';
import Profile from './components/Profile';
import Tasks from './components/Tasks';
import Slicing from './components/Slicing';
import { useState } from 'react';


function App() {
  const myWidth = 200;
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'));

  const handleLogin = (newAccessToken) => {
    setAccessToken(newAccessToken);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    setAccessToken(null);
  };

  if (!accessToken) {
    return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar
        drawerWidth={myWidth}
        content={
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/bending" element={<WymiarowanieZbrojenia />} />
            <Route path="/slicing" element={<Slicing />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        }
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
