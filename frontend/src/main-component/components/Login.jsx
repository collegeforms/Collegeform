import React, { useState, useContext } from 'react';
import './Signup.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom';
import LockIcon from "@mui/icons-material/Lock";
import AuthContext from '../context/AuthContext'; // Import Auth Context

const Login = () => {
  const { loginUser } = useContext(AuthContext); // Get login function from context
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/"); // Redirect after successful login
    } catch (err) {
      
      setError(err.message);
    }
  };

  return (
    <div className="containerss">
      <div className="signup-form text-start">
        <div className="img-div">
          <img src="/img/college-logo-2.png" width={"200px"} alt="" />
        </div>
        
        <h1 className='text-start'>Login to Your Account</h1>
        {error && <p className="error">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
   
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <p className='mt-2'><Link to={"/user/forgot-password"}>Forgot Password?</Link></p>

          <button type="submit" className="submit-btn">Login <LockIcon className="ms-2" /></button>
        </form>

        <p className='mt-4'>Don't have an account? <Link to={"/user/signup"}>Sign Up</Link></p>
      </div>
      <div className="image-section"></div>
    </div>
  );
};

export default Login;
