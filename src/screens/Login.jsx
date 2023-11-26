"use client"

import Link from 'next/link';
import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { imageLogin } from '@/utility/imports';
import '../app/styles/login.css'
import Image from 'next/image';

const Login = () => {

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setpassword] = useState();

  const UserLogin = async (userData) => {
    try {
      const response = await axios.post("https://foodorder-backend.onrender.com/api/user/login", userData)
      return response;
    } catch (error) {
      console.error("Login failed", error);
      return error.response;
    }
  }

  const handleLogin = async () => {
    if (!password) {
      alert("Please type your password");
    }
    if (!name) {
      alert("Please type your Name")
    }
    else {
      const userData = {
        name,
        email,
        password
      };
      const response = await UserLogin(userData);
      if (response.status === 200) {
        localStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = '/HomeScreen';
      }
      else if (response.status === 400) {
        alert("Incorrect email");
      }
      else if (response.status === 401) {
        alert("Incorrect password");
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("storeData")) {
      window.location.href = '/';
    }
  }, [])

  return (
    <div className='LoginPage'>

      <Image className='loginBgImg' width={800} height={800} src={imageLogin.src} alt="loginBackgroudImg" />
      <h2>LOGIN</h2>
      <div className='LoginDiv'>
        <div className='loginInputs'>
          <div>
            <input required value={name} onChange={(e) => { setName(e.target.value) }} type="text" placeholder='name' />
            <input required value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder='email' />
            <input required value={password} onChange={(e) => { setpassword(e.target.value) }} type="password" placeholder='password' />
            <div className='loginButtons'>
              <button onClick={handleLogin}>LOGIN</button>
            </div>
          </div>
          <Link href="/register"><span style={{ color: 'white' }}>Click Here To Register</span></Link>
        </div>
      </div>
    </div>
  )
}

export default Login;