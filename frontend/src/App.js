import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import About from './components/About';
import Create from './components/Create';
import NavBar from './components/NavBar';
import WymiarowanieZbrojenia from './components/WymiarowanieZbrojenia';
import Projects from './components/Projects';

function App() {
  const myWidth = 200;
  return (
    <div className="App">
      <NavBar
        drawerWidth={myWidth}
        content={
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/create" element={<Create />} />
            <Route path="/bending" element={<WymiarowanieZbrojenia />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        }
      />
      
    </div>
  );
}
export default App;