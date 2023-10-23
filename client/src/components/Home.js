import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom";
import {useAuth} from "../auth"
import Recipe from "./Recipe";
import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";

const LoggedInHome=()=>{
    const [show,setShow]=useState(false)
    const [recipeId,setRecipeId]=useState(0);
    const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [''],
  });
    const {register,reset,handleSubmit,setValue,formState:{errors}} = useForm();
      const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, '']
    });
  };
      const [recipes, setRecipes]=useState([])

  const handleIngredientChange = (e, index) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = e.target.value;
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients,
    });
  };


  const updateRecipe = (data) => {
    console.log(data);

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
    const requestOptions = {
      method: 'PUT',
      headers: {
        'content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(data), // Send the constructed data object
    };

    fetch(`/recipe/recipe/${recipeId}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        reset();
        setRecipe({
        title: '', // Reset the title
        description: '', // Reset the description
        ingredients: [''], // Reset the ingredients

      });
        const reload = window.location.reload()
        reload()
        setShow(true)
        setTimeout(() => {
          setShow(false);
    }, 3000);
      })
      .catch(err => console.log(err));}


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

    const showModal=(id)=>{
            setShow(true)
            setRecipeId(id)
            recipes.map(
                    (recipe)=>{
                if(recipe.id===id){
                    console.log(recipe)
                    setValue('title',recipe.title)
                    setValue('description',recipe.description)
                    setValue("ingredients", recipe.ingredients)
                }
            }
        )

    }

    const deleteRecipe=(id)=>{
      const confirmed = window.confirm("Are you sure you want to delete this recipe?");
      if (!confirmed) {
        return; // User canceled the delete action
      }
        console.log(id)
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
        const requestOptions = {
      method: 'DELETE',
      headers: {
        'content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };
         fetch(`/recipe/recipe/${id}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        const reload = window.location.reload()
        reload()
      })
      .catch(err => console.log(err));
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
                    <form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            {...register("title")}
          />
        </Form.Group>
        {errors.title && <p style={{ color: 'red' }}><small>Title is required</small></p>}
        {errors.title?.type === "maxLength" && <p style={{ color: 'red' }}>
          <small>Title should be less than 25 characters</small>
        </p>}
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            {...register("description")}
          />
        </Form.Group>
        {errors.description && <p style={{ color: 'red' }}><small>Description is required</small></p>}
        {errors.description?.type === "maxLength" && <p style={{ color: 'red' }}>
          <small>Description should be less than 255 characters</small>
                </p>}
        <br/>
        <Form.Group>
          <Form.Label><h5>Ingredients</h5></Form.Label>
          {recipe.ingredients.map((ingredient, index) => (
            <div className='ingredient' key={index}>
              <Form.Control
                type="text"
                {...register(`ingredients[${index}]`)}
                defaultValue={ingredient}
                // Note: Use 'defaultValue' instead of 'value' to populate the field
                onChange={(e) => handleIngredientChange(e, index)}
              />
            </div>
          ))}
          <br/>
          <small>
            <Button variant="secondary" onClick={handleSubmit(handleAddIngredient)}>
              Add Ingredient
            </Button>
          </small>
        </Form.Group>
        <br/>
        <Button variant="primary" onClick={handleSubmit(updateRecipe)}>
          Save Recipe
        </Button>
      </form>
                </Modal.Body>
            </Modal>
            <h1>List of Recipes</h1>
            {
                 recipes.map(
                     (recipe, index)=>(
                         <Recipe title={recipe.title}
                                 key={index}
                                 description={recipe.description}
                                 ingredients={recipe.ingredients}
                                 onClick={()=>{showModal(recipe.id)}}

                                 onDelete={()=>{deleteRecipe(recipe.id)}}
                         />
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