import React from "react"
import {Link} from "react-router-dom";
import {useAuth} from "../auth"

const LoggedInHome=()=>{
    return(
        <div className="recipes">
            <h1>List of Recipes</h1>
        </div>
    )
}

const LoggedOutHome=()=>{
    return(
        <div className="recipes">
            <h1>List of Recipes</h1>
        </div>
    )
}


const HomePage=()=>{

    const [logged] = useAuth()

    return(
        <div className="home container">
            {/*<h1>Welcome to the Recipes App</h1>*/}
            {/*<Link to="/signup" className="btn btn-primary btn-block btn-lg">Sign Up for membership</Link>*/}
            {logged?<LoggedInHome/>:<LoggedOutHome/>}
        </div>
    )
}

export default HomePage