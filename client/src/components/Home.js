import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom";
import {useAuth} from "../auth"
import Recipe from "./Recipe";
import {Modal} from "react-bootstrap";

const LoggedInHome=()=>{
    const [show,setShow]=useState(false)

    const [recipes, setRecipes]=useState([])

    useEffect(
        ()=>{
            fetch('recipe/recipes')
                .then(res=>res.json())
                .then(data=> {
                    console.log(data)
                    setRecipes(data)
                })
                .catch(error=>console.log(error))
        }, []
    );

    const closeModal=()=>{
        setShow(false)
    }

    return(
        <div className="recipes">
            <Modal
            show={show}
            size="lg"
            onHide={closeModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Recipe
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Update</p>
                </Modal.Body>
            </Modal>
            <h1>List of Recipes</h1>
            {
                 recipes.map(
                     (recipe)=>(
                         <Recipe title={recipe.title} description={recipe.description}/>
                     )
                 )
            }
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