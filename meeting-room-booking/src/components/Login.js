import React, { useState } from 'react'
import Navbar from './Navbar';
import axios from 'axios'
export default function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    
    axios.defaults.baseURL = "http://192.168.0.132:3001";
    axios.interceptors.request.use(
        (config)=>{
            const token = localStorage.getItem('token');
            if(token){
                config.headers.Authorization = `Bearer${token}`;
            }
            return config;
        },
        (error)=>{
            return Promise.reject(error);
        }
    );

    const handleLogin = async() =>{
        try{
            const response = await axios.post("http://192.168.0.132:3001/api/login",{
                username,password
            });
            if(response.data.token){
                const {token, user} = response.data;
                localStorage.setItem('token' , token);
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                alert("Login Success!");
                window.location.href = "/userDashboard";
            }else{
                alert("Invalid Password!");
            }
        }catch(error){
          console.error("Error during login:", error);
          alert("user Not Found or Internal Server Error");
        }
    };


  return (
    <>
      <Navbar title="User Login Panel" />
      <div className="container">
        <h2 className="my-3">User Login</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="btn btn-primary"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
