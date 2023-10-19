import React, {useState} from "react"
import {Button, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form"
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '../auth';
import { useNavigate  } from 'react-router-dom';


const schema = yup.object().shape({
  username: yup.string().required('Username is required').max(25, 'Max length is 25 chars'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
});

const LoginPage=()=>{

    const {register,watch,reset,handleSubmit,formState:{errors}} = useForm({
          resolver: yupResolver(schema)
    });
    const history=useNavigate()




    const loginUser=(data)=>{
       console.log(data)

       const requestOptions={
           method:"POST",
           headers:{
               'content-type':'application/json'
           },
           body:JSON.stringify(data)
       }

       fetch('/auth/login',requestOptions)
       .then(res=>res.json())
       .then(data=>{

           if (data){
            login(data.access_token)

             history('/')
           }
           else{
               alert('Invalid username or password')
           }


       })



       reset()
    }




    return (
        <div className="container">
            <div className="signup-form">
                <form className="formax" action="">
                    <h1>Login Page</h1>
                  <Form.Group className="formmm">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Enter your username"
                          {...register("username", {
                              required: true,
                              maxLength: 25,
                          })}
                      ></Form.Control>
                      {errors.username && <span style={{ color: "red" }}><small>{errors.username.message}</small></span>}
                  </Form.Group>
                  <Form.Group className="formmm">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          {...register("password", {
                              required: true,
                              minLength: 8,
                          })}
                      ></Form.Control>
                      {errors.password && <span style={{ color: "red" }}><small>{errors.password.message}</small></span>}
                  </Form.Group>
                  <Form.Group>
                      <Button className="acaca" as="sub" variant="primary" onClick={handleSubmit(loginUser)}>Log In</Button>
                  </Form.Group>
                  <Form.Group><small>Don't have an account? </small>
                      <Link to="/signup">Sign Up</Link>
                  </Form.Group>
                </form>
            </div>
        </div>
    )
}

export default LoginPage