"use client"
import React from 'react'
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { imageLogin } from '@/utility/imports';
import "../app/styles/register.css"
import Image from 'next/image';

const Register = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [Cpasswrod, setCpassword] = useState('')
  const [apiData, setApiData] = useState()

  const UserRegister = async (userData) => {
    try {
      const response = await axios.post("https://foodorder-backend.onrender.com/api/user/register", userData);
      setApiData(response)
      return response
    } catch (error) {
      console.error("Registration Failed", error);
    }
  };

  const handleRagister = async () => {
    if (password !== Cpasswrod) {
      alert("passwords not matched")
    }
    else if (!name) {
      alert("please type name")
    }
    else {
      const userData = {
        name,
        email,
        password
      }
      const response = await UserRegister(userData);
      if (response.status === 201) {
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    }
  }

  return (
    <div className='RegisterPage'>
      <Image className='loginBgImg' width={800} height={800} src={imageLogin.src} alt="loginBackgroudImg" />
      <h2>REGISTER</h2>
      <div className='registerDiv'>
        <div className='registerInputs'>
          <div>
            <input required value={name} onChange={(e) => { setName(e.target.value) }} type="text" placeholder='name' />
            <input required value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder='email' />
            <input required value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder='password' />
            <input required value={Cpasswrod} onChange={(e) => { setCpassword(e.target.value) }} type="password" placeholder='confirm password' />
            <div className='registerButtons'>
              <button onClick={handleRagister}>REGISTER</button>
            </div>
          </div>
          <Link href="/login"><span style={{ color: 'white', fontSize: '13px', textDecoration: 'underline' }}>Click Here To Login</span></Link>
        </div>
      </div>
    </div>
  )
}

export default Register;