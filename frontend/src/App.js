import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/HomeModule/Home';
import About from './components/AboutModule/About';
import NavBar from './components/LayoutModule/NavBar';
import Login from './components/LoginModule/Login';
import Profile from './components/ProfileModule/Profile';
import Projects from './components/ProjectsModule/Projects';
import Tasks from './components/TasksModule/Tasks';
import Clients from './components/ClientsModule/Clients';
import Users from './components/UsersModule/Users';
import ReinforcementDimensioning from './components/ReinforcementDimModule/ReinforcementDimensioning';
import Slicing from './components/SlicingModule/Slicing';
import AxiosInstance from './Axios';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from './theme/colors';
import { CssBaseline } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  const myWidth = 200;
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'));
  const [userData, setUserData] = useState(null);

  const handleLogin = (newAccessToken) => {
    setAccessToken(newAccessToken);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUserData(null);
  };

  useEffect(() => {
    if (accessToken) {
      AxiosInstance.get('/users/me/')
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          handleLogout();
        });
    }
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="App">
        <ThemeProvider theme={darkTheme}> 
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ThemeProvider>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="App">
        <ThemeProvider theme={darkTheme}>
          <p>Loading...</p>
        </ThemeProvider>
      </div>
    );
  }

  const userRole = userData.role; 

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <NavBar
            drawerWidth={myWidth}
            content={
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/reinforcementDimensioning" element={<ReinforcementDimensioning />} />
                <Route path="/slicing" element={<Slicing />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
                <Route path="/clients"
                  element={ userRole === 'Boss' ? <Clients /> : <Navigate to="/" /> }
                />
                <Route path="/users"
                  element={ userRole === 'Boss' ? <Users /> : <Navigate to="/" /> }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            }
            onLogout={handleLogout}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;