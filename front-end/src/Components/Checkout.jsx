import React, { useEffect, useState } from 'react'
import logo from '../Assets/Logo.jpg'
import photo from '../Assets/download.png'
import '../css/Check.css'
import { MdOutlineDateRange } from "react-icons/md";
import { MdNoteAlt } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa6";
import { MdOutlineSaveAlt } from "react-icons/md";
import { MdOutlineClear } from "react-icons/md";
import { useRef } from 'react';
import signatureimage from '../Assets/signature-image.svg'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function CheckOut() {

  const [inputid, setinputid] = useState(localStorage.getItem("myId"))
  const [user, setuser] = useState()
  const [reason, setreason] = useState('')
  const [records, setRecords] = useState([]);
  const [date, setdate] = useState();
  const [empdata, setempdata] = useState([])
  const [errors, setErrors] = useState({});
  const [isSigned, setIsSigned] = useState(false);
  const clrCanavasRf = useRef()
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  const token = Cookies.get('token'); // Get the token cookie
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/empdata`, {
      headers: {
        Authorization: `${token}`  // Set the token in Authorization header
      }
    })
      .then((data) => setempdata(data.data))
      .catch((err) => {
        toast.warning(`${err.
          response.
          data.
          message
          } ${err?.status} `)
        console.log(err)

        navigate("/login")
      })

  }, [])

  localStorage.setItem("sign", JSON.stringify(signatureimage))



  var filt
  var matchObj
  matchObj = empdata.find((data) => data.Emp_Id === localStorage.getItem("myId"))
  console.log(matchObj, 'matchObj');


  const handlr = (data) => {
    const { name, value } = data.target
    setinputid(value)
    filt = empdata.find(data => data.Emp_Id === value)
    localStorage.setItem("myId", value);
    setuser({ ...filt })
  }

  console.log(user, 'user');
  const canvas = useRef(null);
  useEffect(() => {
    isdrow()
  }, [user, empdata]);

  const isdrow = function () {


    if (!matchObj) return

    // const canvas = document.getElementById('signature-pad');
    // console.log(canvas, 'in is draw');

    const ctx = canvas.current.getContext('2d');



    let drawing = false;
    let isSigned = false; // Track if user has started drawing
    const placeholderSignature = new Image();

    // Load the signature image (change the path to the actual signature image)
    placeholderSignature.src = JSON.parse(localStorage.getItem("sign"))

    // Draw the placeholder image on the canvas
    placeholderSignature.onload = function () {
      drawPlaceholderSignature();
    };

    // Function to draw the placeholder signature
    function drawPlaceholderSignature() {
      if (!isSigned) {
        ctx.drawImage(placeholderSignature, canvas.current.width / 4, canvas.current.height / 4, canvas.current.width / 2, canvas.current.height / 2); // Adjust image position and size
      }
    }

    // Start drawing when mouse is pressed


    function startDrawing(e) {
      setIsSigned(true)
      if (!isSigned) {
        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        isSigned = true;  // Prevent the placeholder from being drawn again
      }
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    }

    // Draw as the mouse moves
    function draw(e) {


      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }

    // Stop drawing when mouse is released
    function stopDrawing() {
      drawing = false;
    }

    // Clear the canvas and re-draw the placeholder
    clrCanavasRf.current = function clearSignature() {
      setIsSigned(false)
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      isSigned = false;
      drawPlaceholderSignature(); // Redraw the placeholder
    }
    // function clearSignature() {
    //   ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    //   isSigned = false;
    //   drawPlaceholderSignature(); // Redraw the placeholder
    // }


    // Add event listeners for drawing
    canvas.current.addEventListener('mousedown', startDrawing);
    canvas.current.addEventListener('mousemove', draw);
    canvas.current.addEventListener('mouseup', stopDrawing);
    canvas.current.addEventListener('mouseleave', stopDrawing);

    // Clear button functionality
    document.getElementById('clear-btn').addEventListener('click', clrCanavasRf.current);
    const datetimeInput = document.getElementById('datetime-input');

    // Get the current date and time
    const now = new Date();

    // Format the date and time to 'YYYY-MM-DDTHH:MM'
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Create the formatted datetime string
    setdate(`${year}-${month}-${day}T${hours}:${minutes}`);

    // Set the value of the datetime-local input
    datetimeInput.value = date

  };
  const localStorageKey = 'CheckIndata';

  const getRecords = () => {
    const records = localStorage.getItem(localStorageKey);
    return records ? JSON.parse(records) : [];
  };

  const saveRecords = (records) => {
    localStorage.setItem(localStorageKey, JSON.stringify(records));
  };

  useEffect(() => {
    const storedRecords = getRecords();
    setRecords(storedRecords);
  }, []);

  console.log(canvas, 'canvas');
  const validate = () => {
    let newErrors = {};

    // Text validation
    if (!reason) {
      newErrors.name = 'Reason is required';
    }

    // Canvas signature validation
    if (!isSigned) {
      newErrors.signature = 'Signature is required';
    }

    return newErrors;
  };

  const handlecheckOut = async () => {

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const dataURL = canvas.current.toDataURL('image/png');
      try {
        if (!matchObj.Emp_Id) return;
        const response = await axios.post(`${process.env.REACT_APP_URL}/CheckOutemployee`, {
          empcode: inputid,
          datetime: date,
          Reason: reason,
          empsign: dataURL
        });
        console.log(response);
        toast.success(response.data);
      } catch (error) {
        toast.warning(error.response.data.message);
      }
      setreason('')
      setinputid(localStorage.removeItem("myId"))
      clrCanavasRf.current()
    } else {
      setErrors(validationErrors);
    }




    // Optionally, save it in localStorage
    // JSON.stringify(localStorage.setItem("usersign", dataURL));
    // matchObj.reason = reason
    // matchObj.date = date
    // matchObj.sign = localStorage.getItem("usersign")

    // // Check for duplicates
    // const isDuplicate = records.some(record => record.id === matchObj.id);
    // if (isDuplicate) {
    //   alert('Record already exists!');
    //   return;
    // }




    // // Add new record and update state
    // const updatedRecords = [...records, matchObj];
    // setRecords(updatedRecords);
    // saveRecords(updatedRecords);


    // const checkData = localStorage.getItem('tabledata') &&JSON.parse(localStorage.getItem('tabledata'))

    // if (checkData.length === 0) {
    //     localStorage.setItem('tabledata',JSON.stringify([user]))
    //     console.log(checkData,'checkData'); 
    //   }else{
    //     checkData.push(user)
    //     localStorage.setItem('tabledata',JSON.stringify(checkData))

    //   }


  }
  
  return (
    <div className='check-container'>
      <div className='emp-code'>
        <div>
          <img src={logo} style={{ width: '33%' }} />
        </div>
        <h1>Enter Employee Code</h1>
        {/* <input type='text' name='apply' value={matchObj ? localStorage.getItem("myId") : filt?.id} onChange={handlr} /> */}
        <input type='text' name='apply' value={inputid} onChange={handlr} />
      </div>

      {/* {
        user?.map((user,i) => { */}

      {matchObj ? <div >
        <img src={matchObj.Emp_Img} width='100' />
        <h1 style={{
          fontSize: 'large',
          marginTop: '44px',
          color: '#094b6e'
        }}>Hi,<br />{matchObj.Emp_Nm}</h1>
        <div className='inputdiv'>
          <MdOutlineDateRange />
          <input type='datetime-local' id="datetime-input" value={date} />
        </div>
        <div className='inputdiv'>
          <MdNoteAlt />
          <textarea placeholder='Enter Reason' value={reason} onChange={(e) => setreason(e.target.value)} />
        </div>
        {errors.name && <span style={{ color: '#b83232' }}>{errors.name}</span>}

        <div className='inputdiv'>
          <FaFileSignature style={{ position: 'absolute' }} />
          <canvas id="signature-pad" ref={canvas} style={{ width: '100%', height: '100%' }}></canvas>

          <MdOutlineClear id="clear-btn" style={{ position: 'absolute', right: '30px', cursor: 'pointer' }} />
          {/* <MdOutlineSaveAlt id="save-btn" style={{ position: 'absolute', right: '30px', bottom: '100', cursor: 'pointer' }} /> */}
        </div>
        {errors.signature && <span style={{ color: '#b83232' }}>{errors.signature}</span>}

        <div>

        </div>
        <button id='chkin' onClick={handlecheckOut}>Check Out</button>

      </div> : inputid ? <h1>Invalid Employee Code</h1> : <h1>Please Enter Your Employee Code</h1>}
      {/* })
      } */}
    </div >
  )
}

export default CheckOut
