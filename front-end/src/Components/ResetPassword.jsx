import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function ResetPassword() {


    const [Password, setPassword] = useState('')
    const [Conpassword, setConpassword] = useState('')
    const history = useNavigate();
    const { id } = useParams();

    // Password validation function
    function validatePassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordPattern.test(password)) {
            return 'Password must contain At least 8 characters long one uppercase and lowercase letter one digit and special character!';
        }

        return true; // Password is valid
    }

    const ForgetPass = (e) => {
        e.preventDefault();

        const validationResult = validatePassword(Password);

        if (Password == Conpassword) {
            try {
                if (validationResult === true) {
                    const res = axios.post('/Forget', { id, Password })
                    res.then((data) => {
                        toast.success(data.data.message)
                        history('/login')
                        setPassword('')
                        setConpassword('')
                    }).catch(err => toast.warning(err.response.data.message))
                } else {
                    toast.error(validationResult)
                }


            } catch (error) {
                if (error) {
                    toast.error(error)
                }
            }
        } else {
            toast.error('Password not match!')
        }

    }

    useEffect(()=>{
        
    },[])

    return (
        <div>
            <form onSubmit={ForgetPass}>
                <div className='forget-container'>
                    <h1>Reset Password</h1>
                    <div  style={{
                        textAlign: 'center',
                        color: 'darkgoldenrod',
                    }}>Please enter a new password
                    for your account {localStorage.getItem('email')}.</div>

                    {/* <label htmlFor="EmailId">Email Id</label>
                    <input type='email' placeholder='Enter Your Email'
                        required value={email} onChange={(e) => setemail(e.target.value)} /> */}
                    <label htmlFor="password">New Password</label>
                    <input type='password' placeholder='Enter New Password'
                        required value={Password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="conpassword">New Conform Password</label>
                    <input type='password' placeholder='Enter New Conform Password'
                        required value={Conpassword} onChange={(e) => setConpassword(e.target.value)} />
                    <button type='submit'>Reset</button>
                    <Link to='/login' style={{
                        width: 'fit-content',
                        alignSelf: 'center'
                    }}>Back To Login</Link>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword
