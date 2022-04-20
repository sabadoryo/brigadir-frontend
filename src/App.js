import { Container } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Welcome } from './components/welcome/Welcome'
import Header from './components/layout/header'
import React, { useState } from 'react';
import Login from './components/login/Login'
import isAuthenticated from './components/login/isAuthenticated';
import { login } from './redux/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux'
import { Profile } from './components/profile/Profile';

function App() {
  const dispatch = useDispatch()

  if (!isAuthenticated()) {
    return (<Login/>)
  }

  dispatch(login())

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/" element={<Welcome />} />
      </Routes>
    </div>
  );
}

export default App;
