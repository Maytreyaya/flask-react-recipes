import React, {useState} from "react"
import {Button, Form} from "react-bootstrap";
import {Link} from "react-router-dom";


const LoginPage=()=>{
    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')

    const loginForm=()=>{
        console.log(username)
        console.log(password)

        setUsername('')
        setPassword('')
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
                          value={username}
                          name="username"
                          onChange={(e)=>{setUsername(e.target.value)}}
                      ></Form.Control>
                  </Form.Group>
                  <Form.Group className="formmm">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          name="password"
                          onChange={(e)=>{setPassword(e.target.value)}}
                      ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                      <Button className="acaca" as="sub" variant="primary" onClick={loginForm}>Log In</Button>
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