import React, {useState} from "react"
import {
    Form,
    Button
} from "react-bootstrap"
import "../styles/main.css"
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  username: yup.string().required('Username is required').max(25, 'Max length is 25 chars'),
  email: yup.string().required('Email is required').max(80, 'Max length is 80 chars'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

const SignUpPage=()=>{
    // const [username, setUsername]=useState('')
    // const [email, setEmail]=useState('')
    // const [password, setPassword]=useState('')
    // const [confirmPassword, setConfirmPassword]=useState('')

    const {register,watch,reset,handleSubmit,formState:{errors}} = useForm({
          resolver: yupResolver(schema)
    });

    const submitForm=(data)=>{
        console.log(data)

        if (data.password === data.confirmPassword) {
            const body = {
                    "username": data.username,
                    "email": data.email,
                    "password": data.password,
                }
            const requestOptions = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(body),

            }
            fetch("auth/signup", requestOptions)
                .then(res=>res.json())
                .then(data=>console.log(data))
                .catch(err=>console.log(err))
        reset()
        }
        else {
            alert("Passwords do not match!")
        }
    }

    console.log(watch("username"));



    return(
        <div className="container">
            <div className="signup-form">
                <form className="form" action="">
                    <h1>Sign Up</h1>
                  <Form.Group className="formmm">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Enter your username"
                          {...register("username",{
                              required:true,
                              maxLength:25})}
                          // value={username}
                          // name="username"
                          // onChange={(e)=>{setUsername(e.target.value)}}
                      ></Form.Control>
                      {errors.username && <span style={{color:"red"}}><small>Username is required</small></span>}
                      {errors.username?.type==="maxLength" && <span style={{color:"red"}}> Max length is 25 chars </span>}
                  </Form.Group>
                  <Form.Group className="formmm">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          {...register("email",{
                              required:true,
                              maxLength:80,
                          }, )}
                          // value={email}
                          // name="email"
                          // onChange={(e)=>{setEmail(e.target.value)}}
                      ></Form.Control>
                      {errors.email && <span style={{color:"red"}}><small>Email is required</small></span>}
                      {errors.username?.type==="maxLength" && <span style={{color:"red"}}> Max length is 80 chars </span>}
                  </Form.Group>
                  <Form.Group className="formmm">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          {...register("password",{
                              required:true,
                              minLength:8,
                          }, )}
                          // value={password}
                          // name="password"
                          // onChange={(e)=>{setPassword(e.target.value)}}
                      ></Form.Control>
                      {errors.password && <span style={{color:"red"}}><small>Password is required</small></span>}
                      {errors.password && <span style={{color:"red"}}><small>Password must be at least 8 char long</small></span>}
                  </Form.Group>
                  <Form.Group className="formmm">
                      <Form.Label>Confirm password</Form.Label>
                      <Form.Control
                          type="password"
                          placeholder="Repeat your password"
                          {...register("confirmPassword",{
                              required:true,
                              minLength:8,
                          }, )}
                          // value={confirmPassword}
                          // name="confirmPassword"
                          // onChange={(e)=>{setConfirmPassword(e.target.value)}}
                      ></Form.Control>
                      {errors.confirmPassword && <span style={{ color: "red" }}><small>{errors.confirmPassword.message}</small></span>}

                  </Form.Group>
                  <Form.Group>
                    <Button className="acaca" as="sub" variant="primary" onClick={handleSubmit(submitForm)}>Submit</Button>
                  </Form.Group>
                  <Form.Group><small>Already have an account? </small>
                      <Link to="/login">Login</Link>
                  </Form.Group>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage