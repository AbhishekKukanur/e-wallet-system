import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Register(){
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const registerUser = (e) =>{
    e.preventDefault()
    if(phoneNumber.length === 0){
      alert("Phone number cannot be blank")
    }
    else if(password.length===0){
      alert("Password cannot be blank")
    }
    else if(name.length===0){
      alert("Name cannot be blank")
    }
    else{
      console.log(phoneNumber,password)
      axios.post("http://127.0.0.1:5000/signup",{
        phoneNumber:phoneNumber,
        password:password,
        name:name
      })
      .then(function(response){
        console.log(response);
        alert("Success! Account has been created")
        navigate('/');
      })
      .catch(function(error){
        console.log(error,'error');
        if(error.response.status === 409){
          alert("Account already exists with"+{phoneNumber}+"number");
        }
      })
    }
  }

    return(
        <div className="d-flex justify-content-center align-items-center bg-black vh-100">
          <div className="bg-white p-3 rounded w-25">
            <form action="">
              <h3>Sign Up</h3>
              <div className="mb-3">
                <label htmlFor="name">Name</label>
                <input className="form-control" type="text" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value) }/>
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input className="form-control" type="number" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value) }/>
              </div>
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input className="form-control" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className="text-center">
                <button className="btn btn-primary w-50" onClick={registerUser}>Register</button>
              </div>

            </form>
          </div>
    
        </div>
      )
    }
