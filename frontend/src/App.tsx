import React from 'react';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register';
import Profile from './components/Profile';



function App() {
  return (
    <div className="App">
      <Router>
      <Header></Header>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='about' element={<About />}/>
          <Route path='login' element={<Login />}/>
          <Route path='register' element={<Register/>}/>
          <Route path='profile' element={<Profile/>}/>
        </Routes>

      </Router>
    </div>
  );
}

export default App;
