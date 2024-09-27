import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import {BrowserRouter as Router , Routes , Route, BrowserRouter} from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/Home/Home';
import Landing from './pages/Landing/Landing';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path='/login' element = {<Login/>} />
          <Route path='/landing' element = {<Landing/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
