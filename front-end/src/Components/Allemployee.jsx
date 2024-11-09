import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import loader from '../Assets/loading.gif'
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { json, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { IoIosAddCircle } from "react-icons/io";
import 'reactjs-popup/dist/index.css';
import { useCallback } from 'react';
function Allemployee() {
    const [empdata, setempdata] = useState([])
    const [close, setclose] = useState(false)
    const [addclose, setaddclose] = useState(false)
    const [dpclose, setdpclose] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [empCode, setEmpCode] = useState(localStorage.getItem("empCode"));
    const [id, setId] = useState();
    const [profile, setProfile] = useState('');
    const [empbyid, setempbyid] = useState([])
    const [empName, setEmpName] = useState('');
    const [Name, setName] = useState('');
    const token = Cookies.get('token'); // Get the token cookie
    const navigate = useNavigate()


    console.log(empdata,'empdata');
    
    
    axios.defaults.withCredentials = true;

    // Function to handle form submission
    const Updateemployee = useCallback(async (e) => {
        e.preventDefault();

        setLoading(true)
        const formData = new FormData();

        formData.append('empName', empName);
        formData.append('imgprofile', profile);

        try {
            const response = await axios.put(`${process.env.REACT_APP_URL}/updateemployee/${empbyid?.Emp_Id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Employee Updated successfully!');
            setclose(false)

        } catch (error) {

            if (error) {
                toast.warning(error?.response?.data?.message);

            }
        } finally {
            setLoading(false)
        }


        setEmpName('');
        setProfile(null);
    }, [empbyid?.Emp_Id, profile, empName]);



    const empdelete = useCallback(async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_URL}/empdelete/${id}`)
                .then(res => console.log(res))
                .catch(err => console.error(err)
                )
            setdpclose(!true)
            toast.success('Deleted Successfully!')
        } catch (error) {
            toast.error(error)
        }
    }, [dpclose])

    useEffect(() => {
        localStorage.setItem('empCode', empCode)
    }, [empCode])
    useEffect(() => {
        if (empbyid) {
            setEmpName(empbyid?.Emp_Nm);
        }
    }, [empbyid]);
    const openmodal = (Id) => {

        setclose(!close)

        setId(Id)


    }
    const openpopup = (Id) => {
        setdpclose(true)
        setId(Id)
    }

    useEffect(() => {

        try {
            if (id) {
                console.log(id);
                axios.get(`${process.env.REACT_APP_URL}/getempbyid/${id}`, {
                    headers: {
                        authorization: `${token}`  // Set the token in Authorization header
                    }
                })
                    .then(data => json(setempbyid(data.data[0])))
                    .catch(err => {
                        toast.warning(`${err.
                            response.
                            data.
                            message
                            } ${err?.status} `)
                        console.log(err)

                        navigate("/login")
                    })
            }
        } catch (error) {
            alert(error)
        }

    }, [id])
    console.log(empbyid, 'empbyid...');



    useEffect(() => {
        // if(!token) {
        // return  navigate("/login")
        // }
        console.log(token,'hllo');
        

        try {

            axios.get(`${process.env.REACT_APP_URL}/empdata`, {
                headers: {
                    authorization: `${token}`  // Set the token in Authorization header
                }
            })
                .then((data) => {
                    console.log(data, 'ch');

                    setempdata(data.data)
                })
                .catch((err) => {
                    toast.warning(`${err.
                        response.
                        data.
                        message
                        } ${err?.status} `)
                    console.log(err)

                    navigate("/login")
                })
        } catch (error) {

        }

    }, [id, empCode, Updateemployee, empdelete])
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

    // useEffect(()=>{
    //     empdelete()
    // },[id])
    // Function to handle form submission
    const Addemployee = async (e) => {
        e.preventDefault();

        setLoading(true)
        const formData = new FormData();

        formData.append('empCode', `EMP${empCode}`);
        formData.append('empName', Name);
        formData.append('imgprofile', profile);

        try {
            const response = await axios.post(`${process.env.REACT_APP_URL}/Addemployee`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);

            toast.success(response.data.message);
            setaddclose(false)
            setEmpCode(empCode + 1);

        } catch (error) {
            console.log(error, 'errr');

            if (error) {
                toast.warning(error?.response?.data?.message);
            }
        } finally {
            setLoading(false)
        }


        setName('');
        setProfile(null);
    };
    return (
        <div>
            <button className="button" type='button' onClick={() => setaddclose(!addclose)} style={{
                float: 'right',
                position: 'absolute',
                right: '7px',
                top: '-7px'
            }}  ><IoIosAddCircle /> Add Employee</button>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Employee Code</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {empdata.length > 0 ?
                            empdata?.map((employee, index) => (

                                <tr key={index}>
                                    <td>{employee.Emp_Id}</td>
                                    <td>{employee.Emp_Nm}</td>
                                    <td><img src={`${process.env.REACT_APP_URL}/${employee.Emp_Img}`} alt="Employee" width="50" /></td>
                                    <td><FaEdit onClick={() => openmodal(employee.Emp_Id)} style={{ fontSize: 'x-large', color: 'green', cursor: 'pointer' }} /><MdDelete style={{ fontSize: 'x-large', color: '#de0f0f', cursor: 'pointer' }} onClick={() => openpopup(employee.Emp_Id)} /></td>
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
            <Popup open={dpclose} onClose={() => setdpclose(false)} closeOnDocumentClick={false} modal nested id='popup-2'>
                <div>
                    <p>Are you sure?</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => setdpclose(false)} style={{ margin: '10px' }}>Cancel</button>
                    <button onClick={empdelete}>Delete</button>
                </div>
            </Popup>
            <Popup open={close} onClose={() => setclose(false)} closeOnDocumentClick={false} modal nested id='popup-3'>
                <div className="modal">
                    <button style={{
                        marginTop: '0px',
                        color: 'black',
                        backgroundColor: 'darkgray'
                    }} className="close button" onClick={() => setclose(false)}>
                        &times;
                    </button>
                    <h1>Update Employee</h1></div>
                <div className='addemployee'>
                    <form id='form2' onSubmit={Updateemployee}>
                        {/* Employee Code (Auto-generated, Read-only) */}
                        <div>
                            <label>Employee Code: </label>
                            <input type="text" value={empbyid?.Emp_Id} readOnly />
                        </div>

                        {/* Employee Name */}
                        <div>
                            <label>Employee Name: </label>
                            <input
                                type="text"
                                onChange={(e) => setEmpName(e.target.value)}
                                value={empName}
                                required
                            />
                        </div>

                        {/* Profile Upload */}
                        <div>
                            <label>Upload Profile: </label>
                            <input
                                type="file"
                                // name='profile'
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button type="submit">{Loading ? <img src={loader} width='25' /> : 'Update'}</button>
                        </div>
                    </form>
                </div>
            </Popup>
            <Popup open={addclose} onClose={() => setaddclose(false)} closeOnDocumentClick={false} modal nested id='popup-4'>
                <div className="modal">
                    <button style={{
                        marginTop: '0px',
                        color: 'black',
                        backgroundColor: 'darkgray'
                    }} className="close button" onClick={() => setaddclose(false)}>
                        &times;
                    </button>
                    <h1>Add Employee</h1></div>
                <div className='addemployee'>
                    <form id='form2' onSubmit={Addemployee}>
                        {/* Employee Code (Auto-generated, Read-only) */}
                        <div>
                            <label>Employee Code: </label>
                            <input type="text" value={`EMP0${empCode}`} readOnly />
                        </div>

                        {/* Employee Name */}
                        <div>
                            <label>Employee Name: </label>
                            <input
                                type="text"
                                value={Name}
                                onChange={useCallback((e) => { setName(e.target.value) }, [])}
                                required
                            />
                        </div>

                        {/* Profile Upload */}
                        <div>
                            <label>Upload Profile: </label>
                            <input
                                type="file"
                                // name='profile'
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button type="submit">{Loading ? <img src={loader} width='30' /> : 'Submit'}</button>
                        </div>
                    </form>
                </div>
            </Popup>
        </div >
    )
}

export default Allemployee
