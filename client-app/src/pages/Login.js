import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login(){

  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const logInUser = (e) => {
    e.preventDefault()
    if(phoneNumber.length === 0){
      alert("Phone number cannot be blank")
    }
    else if(password.length===0){
      alert("Password cannot be blank")
    }
    else{
      console.log(phoneNumber,password)
      axios.post("http://127.0.0.1:5000/login",{
        phoneNumber:phoneNumber,
        password:password
      })
      .then(function(response){
        console.log(response);
        localStorage.setItem("phoneNumber", phoneNumber)
        navigate('home');
      })
      .catch(function(error){
        console.log(error,'error');
        if(error.response.status === 401){
          alert("Invalid credentials");
        }
      })
    }
  }
  const createAccount = (e) =>{
    navigate("register")

  }
  return(
    <div className="login template d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <form action="">
          <h3>Sign In</h3>
          <div className="mb-3">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input className="form-control" type="number" placeholder="Enter your registered phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value) }/>
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input className="form-control" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="text-center">
            <button className="btn btn-primary w-25" onClick={logInUser}>Login</button>
          </div>
          <br></br>
          <p  className="text-center">
            <button className="btn btn-secondary" onClick={createAccount}>
              Create Account
            </button>
          </p>
        </form>
      </div>

    </div>
  )
}

export default Login;