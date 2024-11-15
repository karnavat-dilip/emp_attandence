import React, { useEffect, useState } from 'react'
import '../css/Checkintable.css'
import Cookies from 'js-cookie';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function Checkintable() {
    const [employees, setemployees] = useState([])
    const token = Cookies.get('token'); // Get the token cookie
    axios.defaults.withCredentials = true;
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/getcheckin`, {
            headers: {
                Authorization: `${token}`  // Set the token in Authorization header
            }
        })
            .then((data) => setemployees(data.data))
            .catch((err) => {
                toast.warning(`${err.
                    response.
                    data.
                    message
                    } ${err?.status} `)
                console.log(err)

                navigate("/login")
            })
    }, [employees])
    return (
        <div>
            <div>
                <h3 style={{
                        textAlign: 'center',
                        fontFamily: 'auto',
                        margin: '0',
                        position: 'relative',
                        bottom: '-34px',
                }}>CheckIn employees</h3></div>
            <table>
                <thead>
                    <tr>
                        <th>Employee Code</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Reason</th>
                        <th>Image</th>
                        <th>Signature</th>
                    </tr>
                </thead>
                <tbody>
                    {employees?.length > 0 ?
                        employees?.map((employee, index) => (
                            <tr key={index}>
                                <td>{employee.Emp_Code}</td>
                                <td>{employee.Emp_Name}</td>
                                <td>{employee.Emp_Current_Date}</td>
                                <td>{employee.Emp_Reason}</td>
                                <td>
                                    <img src={`${process.env.REACT_APP_URL}/${employee.Emp_Img}`} alt="Employee" width="50" />
                                </td>
                                <td>
                                    <img src={employee.Emp_Signature} alt="Signature" width="100" />
                                </td>
                            </tr>
                        )) : <tr style={{
                            textAlign: 'center',
                            width: '81vw',
                            padding: '15px 0',
                            position: 'fixed',
                            color: 'burlywood'
                        }}>No Records</tr>}
                </tbody>
            </table>
        </div>
    )
}

export default Checkintable
