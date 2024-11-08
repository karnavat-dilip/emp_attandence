// src/Signup.js
import React, { useCallback, useEffect, useState } from 'react';
import '../css/Signup.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { v4 as uuidv4 } from 'uuid';
function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [close, setclose] = useState(false)
  const [redirect, setRedirect] = useState(false);
  const [empCode, setEmpCode] = useState(localStorage.getItem("empCode"));
  const [empName, setEmpName] = useState('');
  const [profile, setProfile] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;

    const validationResult = validatePassword(password);


    if (formData.password == formData.confirmPassword) {
      try {
        if (validationResult === true) {
          const response = await axios.post('/Signup', {
            id: uuidv4(),
            username: formData.username,
            email: formData.email,
            password: formData.password
          });
          // Display result message

          toast.success("Account Created Successfully!");
          setRedirect(true);
          setFormData({
            username: '',
            password: '',
            confirmPassword: ''
          })
        } else {
          toast.error(validationResult)
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Password Not Match!");
    }


  }, [formData]);

  // Password validation function
  function validatePassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordPattern.test(password)) {
      return 'Password must contain At least 8 characters long one uppercase and lowercase letter one digit and special character!';
    }

    return true; // Password is valid
  }

  const handleSignInClick = useCallback(() => {
    setRedirect(true);
  }, []);




  // Function to handle file upload
  const handleFileChange = useCallback((e) => {
    setProfile(e.target.files[0]);
  }, []);
  useEffect(() => {
    const storedCode = localStorage.getItem('empCode');
    if (storedCode) {
      setEmpCode(parseInt(storedCode, 10));
    }
  }, []);



  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form id='form1' onSubmit={handleSubmit}>
        <label htmlFor="username">Email Id</label>
        <input
          type='email'
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder='Enter Your Email'
          required
        />


        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder='Enter Password'
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder='Enter Conform Password'
          required
        />


        <button type="submit">Sign Up</button>
      </form>

      {/* Sign In button */}
      <div className="signin-link">
        <p>OR<br />
          Already have an account?
        </p>
        <button onClick={handleSignInClick} style={{ width: '100%' }}>Sign In</button>
        {redirect && <Navigate to="/login" />}
      </div>

    </div >
  );
}

export default Signup;
