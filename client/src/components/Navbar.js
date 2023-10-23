import React from "react"
import {
    Link
} from "react-router-dom";
import "../styles/main.css"
import { useAuth, logout } from "../auth";



const LoggedInLinks=()=>{
    return(
        <>
                <li className="nav-item active">
                    <Link className="nav-link" to="/">All recipes</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/create-recipe">Create recipe</Link>
                </li>
                <li className="nav-item">
                    <a className="nav-link  active" href="#" onClick={logout}>Log Out</a>
                </li>
        </>
    )
}

const LoggedOutLinks=()=>{
    return(
        <>
                <li className="nav-item active">
                    <Link className="nav-link" to="/">All recipes</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>
        </>
    )
}


const NavBar=()=>{

    const[logged]=useAuth()

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand">Mao Recipes</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {logged?<LoggedInLinks/>:<LoggedOutLinks/>}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar