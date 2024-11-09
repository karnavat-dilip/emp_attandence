import React, { useState } from 'react'
import logo from '../Assets/Logo.jpg'
import { Link, useNavigate } from 'react-router-dom'
import '../css/Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie';
import view from '../Assets/view.png'
import hide from '../Assets/hide.png'
const token = Cookies.get('token'); // Get the token cookie


function Login({setisauthenticated}) {

    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    const history = useNavigate();


    const HandleSignIn = async (e) => {

        try {
            await axios.post(`${process.env.REACT_APP_URL}/SignIn`, {
                username: username,
                password: password
            }).then((data) => {
                console.log(data, 'data');

                if (data.data.Status == 'Success') {
                    history('/')
                    localStorage.setItem('authvalue',true)
                    setisauthenticated(JSON.parse(localStorage.getItem('authvalue')))
                    toast.success('Login Successfully')
                } else {
                    toast.error(data.data.Message)
                }

            }
            )
                .catch((err) => console.log(err))
        } catch (error) {
            console.error(error)
        }
    }
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');

    togglePasswordButton?.addEventListener('click', function () {
        const type = passwordInput?.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput?.setAttribute('type', type);

        // Change the button text
        this.src = type === 'password' ? view : hide;
    });

    return (
        <div className='Login-container'>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                top: '-38px',
            }}>
                <img src={logo} alt='logo not available' style={{
                    width: '76%',
                }} />
            </div>
            <div>
                <h5 style={{
                    textAlign: 'center',
                    fontSize: '17px',
                    color: '#8daabc',
                    fontWeight: '400'
                }}>Security Staff Login</h5>
                <form id='form1' onSubmit={(e) => HandleSignIn(e.preventDefault())}>
                    <div>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                        }}>
                            <input type='text' placeholder='Username' onChange={(e) => setusername(e.target.value)} required />
                        </div>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                        }}>
                            <input type='password' placeholder='Password' id="password" onChange={(e) => setpassword(e.target.value)} required />
                            <img src={view} id="togglePassword" style={{
                                position: 'absolute',
                                top: '13px',
                                right: '17px',
                                width: '20px',
                                cursor: 'pointer'
                            }} />
                        </div>
                        <div>
                            <Link to='/forgotpassword' style={{
                                color: 'brown',
                                float: 'right',
                                top: 'auto',
                                margin: '9px',
                            }}>Forgot Password?</Link>
                        </div>
                        <button type='submit'>Sign In</button>
                    </div>
                </form>
                <div>
                    <h2>Don't have an account?</h2>
                    <Link to='/signup'>Signup</Link>
                </div>
            </div>

        </div >
    )
}

export default Login
