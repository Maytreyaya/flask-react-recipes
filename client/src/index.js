import React, {useEffect, useState} from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom"
import NavBar from './components/Navbar';

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"
import HomePage from "./components/Home";
import SignUpPage from "./components/SignUp";
import LoginPage from "./components/Login";
import CreateRecipe from "./components/CreateRecipe";

const App=()=>{


    return (
        <Router>
    <div className="container">
        <NavBar />
        <Routes>
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<HomePage />} />
        </Routes>
    </div>
</Router>
    )
}


ReactDOM.render(<App/>,document.getElementById('root'))
