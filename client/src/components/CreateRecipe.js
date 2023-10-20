import React, { useState } from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import {useForm} from "react-hook-form";


const CreateRecipe = () => {
  const [show, setShow] = useState(false);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [''], // Initialize with an empty ingredient
  });

  const {register, reset,handleSubmit, formState:{errors}} = useForm();

  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, ''], // Add an empty ingredient
    });
  };

  const handleIngredientChange = (e, index) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = e.target.value;
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients,
    });
  };


  const saveRecipe = (data) => {


    console.log(data);

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
    console.log(token);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(data), // Send the constructed data object
    };

    fetch('/recipe/recipes', requestOptions)
      .then(res => res.json())
      .then(data => {
        reset();
        setRecipe({
        title: '', // Reset the title
        description: '', // Reset the description
        ingredients: [''], // Reset the ingredients
      });
        setShow(true)
        setTimeout(() => {
          setShow(false);
    }, 3000);
      })
      .catch(err => console.log(err));}


  return (
    <div className="create-recipe">
      {show?
      <Alert className="alert-recipe" variant="success" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Recipe created!</Alert.Heading>
          <p>
          </p>
      </Alert>
              :
      <h2>Create Recipe</h2>
      }
      {/*<h1>Create Recipe Page</h1>*/}
      <form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            {...register("title")}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            {...register("description")}
          />
        </Form.Group>
        <br/>
        <Form.Group>
          <Form.Label><h5>Ingredients</h5></Form.Label>
          {recipe.ingredients.map((ingredient, index) => (
            <div className='ingredient' key={index}>
              <Form.Control
                type="text"
                {...register(`ingredients[${index}]`)}
                value={ingredient}
                onChange={(e) => handleIngredientChange(e, index)}
              />
            </div>
          ))}
          <br/>
          <small><Button variant="secondary" onClick={handleSubmit(handleAddIngredient)}>
            Add Ingredient
          </Button></small>
        </Form.Group>
        <br/>
        <Button variant="primary" onClick={handleSubmit(saveRecipe)}>
          Save Recipe
        </Button>
      </form>
    </div>
  );
};

export default CreateRecipe;