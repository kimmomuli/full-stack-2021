import React from 'react'
import Notification from './Notification'
import { Form, Button } from 'react-bootstrap'

const Login = ({ handleLogin, username, setUserName, password, setPassword }) => {
  return (
    <div className='container'>
      <Notification />
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUserName(target.value)}
          />
          <Form.Label>password:</Form.Label>
          <Form.Control
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="primary" type="submit" id="login-button">login</Button>
        </Form.Group>
      </form>
    </div>
  )
}

export default Login