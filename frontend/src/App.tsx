import React from 'react';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Home from './components/Home/Home';
import About from './components/About/About';
import Login from './components/Login/Login';
import Header from './components/Header/Header';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Collabs from './components/Collabs/Collabs';



function App() {
  return (
    <div className="App">
      <Router>
      <Header></Header>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='login' element={<Login />}/>
          <Route path='register' element={<Register/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='collabs' element={<Collabs/>}/>
        </Routes>

      </Router>
    </div>
  );
}

export default App;
