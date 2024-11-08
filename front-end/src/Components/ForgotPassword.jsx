import React, { useEffect, useRef, useState } from 'react'
import '../css/Forget.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import loader from '../Assets/loading.gif'
import { json, Link } from 'react-router-dom'
function ForgotPassword() {
    const [email, setemail] = useState('')
    const [Loading, setLoading] = useState(false)
    
    const emailref = useRef(null)


    const ForgetPass = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const res = await axios.post('/Sendmail', { email })

            toast.success(res.data.message)
            const chkmail = document.getElementById('chkmail')
            chkmail.style.display = 'block'
            localStorage.setItem('email',emailref.current)
        } catch (error) {
            if (error) {
                toast.error(error.response.data.message)
            }
        } finally {
            setLoading(false)
        }
        setemail('')
    }
    
    return (
        <div>
            <form onSubmit={ForgetPass}>
                <div className='forget-container'>
                    <h1>Forgot Password</h1>
                    <div id='chkmail' style={{
                        textAlign: 'center',
                        color: 'darkgoldenrod',
                        display: 'none'
                    }}>Please check your email '{emailref.current}' for reset your Password.</div>

                    <label htmlFor="EmailId">Email Id</label>
                    <input type='email' placeholder='Enter Your Email'
                        required value={email} onChange={(e) => {
                            setemail(e.target.value);
                            emailref.current = e.target.value
                        }} />
                    <button type='submit'>{Loading ? <img src={loader} width='25' /> : 'Submit'}</button>
                    <Link to='/login' style={{
                        width: 'fit-content',
                        alignSelf: 'center'
                    }}>Back To Login</Link>
                </div>
            </form >
        </div >
    )
}

export default ForgotPassword
