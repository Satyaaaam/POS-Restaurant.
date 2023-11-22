import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authentication, signInWithEmailAndPassword } from '../firebase';
import { roles } from '../roles';
import './AuthComponent.css'
import 'bootstrap/dist/css/bootstrap.css';

// Move state declaration to the top level
let myRole;
const setMyRole = (role) => {
  myRole = role;
};

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Sign in with email and password
      await signInWithEmailAndPassword(authentication, email, password);
      console.log('Login successful');

      // Set user's role in state
      let lowerEmail = email.toLowerCase();
      if (roles.admin.includes(lowerEmail)) {
        setMyRole('admin');
        navigate('/admin');
      } else if (roles.chef.includes(lowerEmail)) {
        setMyRole('chef');
        navigate('/chef');
      } else if (roles.waiter.includes(lowerEmail)) {
        setMyRole('waiter');
        navigate('/waiter');
      }
    } catch (error) {
      alert('Wrong credentials');
      console.error('Login failed', error.code, error.message);
      // Handle errors or redirect to an error page
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login'>
      <h2>LOGIN</h2>
      <form onSubmit={handleLogin}>
        <input
        className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
        placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
         className="form-control" id="exampleInputPassword1" placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit" className='btn btn-success' disabled={loading}>
          {loading ? 'Logging in...' : 'LOGIN'}
        </button>
      </form>
    </div>
  );
};

const getMyRole = () => myRole;

export { getMyRole };
export default AuthComponent;
