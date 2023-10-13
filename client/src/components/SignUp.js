import React, {useState} from "react"
import {
    Form,
    Button,
    Alert
} from "react-bootstrap"
import "../styles/main.css"
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import data from "bootstrap/js/src/dom/data";

const schema = yup.object().shape({
  username: yup.string().required('Username is required').max(25, 'Max length is 25 chars'),
  email: yup.string().required('Email is required').max(80, 'Max length is 80 chars'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

const SignUpPage=()=>{

    const [show, setShow] = useState(false);
    const [serverResponse, setServerResponse]=useState('')
    const [username, setUsername] = useState('');


    const {register,watch,reset,handleSubmit,formState:{errors}} = useForm({
          resolver: yupResolver(schema)
    });

    const submitForm=(data)=>{
        if (data.password === data.confirmPassword) {
            const body = {
                    "username": data.username,
                    "email": data.email,
                    "password": data.password,
                }
                setUsername(data.username)
            const requestOptions = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(body),

            }
            fetch("auth/signup", requestOptions)
                .then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    setServerResponse(data.message)
                    console.log(serverResponse)
                    setShow(true)
                })
                .catch(err=>console.log(err))
        reset()
            console.log(username)

        }
        else {
            alert("Passwords do not match!")
        }
    }

    // console.log(watch("username"));



    return(
        <div className="container">
            <div className="signup-form">
                {show?
                <Alert className="alert-class" variant="success" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>Well done, {username}!</Alert.Heading>
                    <p>
                        {serverResponse}
                        <br/>
                        Welcome Home...
                    </p>
                </Alert>
                        :
                    <dfn><b><p>Welcome back, stranger...</p></b></dfn>
                }
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
                      ></Form.Control>
                      {errors.username && <span style={{ color: "red" }}><small>{errors.username.message}</small></span>}
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
                      ></Form.Control>
                      {errors.email && <span style={{ color: "red" }}><small>{errors.email.message}</small></span>}
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
                      ></Form.Control>
                      {errors.password && <span style={{ color: "red" }}><small>{errors.password.message}</small></span>}
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