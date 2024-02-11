import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navabar from './components/Layout/Navabar';
import Footer from './components/Layout/Footer';

import { Toaster } from "react-hot-toast";
import axios from 'axios';
import NotFound from './components/NotFound/NotFound';
import { Context } from './main';

import "./App.css";
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Application from './components/Application/Application';
import MyApplications from './components/Application/MyApplications';


const App = () => {

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );

        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    fetchUser();
  }, [isAuthorized])

  return (
    <BrowserRouter>
        <Navabar/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/application/:id' element={<Application/>} />
            <Route path='/application/me' element={<MyApplications/>} />
            <Route path='*' element={<NotFound/>} />
        </Routes>
        <Footer/>
        <Toaster/>
    </BrowserRouter>
  )
}

export default App