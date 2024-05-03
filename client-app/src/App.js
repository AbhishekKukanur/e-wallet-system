import React from "react";
import './App.css';

import {BrowserRouter, Routes, Route, defer} from 'react-router-dom';

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";

function App(){
    return(
        <div className="vh-100 gradient-custom">
            <div className="container">
                <h1 className="page-header text-center">Asper e-wallet</h1>

                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="home" element={<Home/>}/>
                        <Route path="register" element={<Register/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
