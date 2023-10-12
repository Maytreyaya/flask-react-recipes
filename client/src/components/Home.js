import React from "react"
import {Link} from "react-router-dom";


const HomePage=()=>{
    return(
        <div className="home container">
            <h1>Welcome to the Recipes App</h1>
            <Link to="/signup" className="btn btn-primary btn-block btn-lg">Sign Up for membership</Link>
        </div>
    )
}

export default HomePage