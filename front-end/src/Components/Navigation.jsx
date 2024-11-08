import React, { useEffect, useState } from 'react'
import menu from '../Assets/menu-bar.png'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { json, Link, Outlet, useNavigate } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { FaPersonCircleXmark } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { FaUserClock } from "react-icons/fa";

function Navigation({setisauthenticated}) {
  const [close, setclose] = useState(false)
  const navigate = useNavigate()

  const handlemenu = () => {

    var menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
    var container = document.querySelector('.container')
    container.classList.toggle('backcolor')

    if (document.querySelector('.hidden')) {
      document.getElementById('zi-1').style.zIndex = '1'

    } else {
      document.getElementById('zi-1').style.zIndex = '-1'
    }

    document.addEventListener('click', function (event) {

      const hamb = document.getElementById('hamberger')
      if (menu && !menu.contains(event.target) && hamb && !hamb.contains(event.target)) {
        menu.classList.add('hidden');
        document.getElementById('zi-1').style.zIndex = '1'
        container.classList.remove('backcolor')
      }
    });
    document.addEventListener('keydown', function (event) {
      const hamb = document.getElementById('hamberger')
      if (event.key !== 'Escape') return

      if (menu && !menu.contains(event.target) && hamb && !hamb.contains(event.target)) {
        menu.classList.add('hidden');
        document.getElementById('zi-1').style.zIndex = '1'
        container.classList.remove('backcolor')
      }
    });


  }
  const Signout = async () => {
    try {

      const res = await axios.get('/SignOut')
        .then(res => json(res))
        .catch(err => console.error(err))
      if (res.ok) {
        localStorage.setItem('authvalue',false)
        setisauthenticated(JSON.parse(localStorage.getItem('authvalue')))
        toast.success('Logout Successfully!')
        navigate('/login')
      }

    } catch (error) {
      console.error(error)
    }
  }
  const logout = () => {
    setclose(true)
    var menu = document.getElementById('menu');
    menu.classList.toggle('hidden');

  }

  const cancel = () => {
    setclose(false)
    var container = document.querySelector('.container')
    container.classList.remove('backcolor')
  }
  return (
    <div className='container'>

      <img src={menu} width='22' style={{
        margin: '11px 12px 0 14px',
        zIndex: '10000',
        position: 'fixed',
        cursor: 'pointer'
      }} onClick={handlemenu} id='hamberger' />
      <nav id="menu" class="hidden">
        <ul>
          <li><Link to="/"><RxDashboard />Dashboard</Link></li>
          <li><Link to="/Check"><FaUserClock />Check</Link></li>
          <li><Link to="/Checkin"><FaPersonCircleCheck /> CheckIn</Link></li>
          <li><Link to="/Checkout"><FaPersonCircleXmark /> CheckOut</Link></li>
          <li><Link style={{ cursor: 'pointer' }} onClick={logout}><IoIosLogOut /> Logout</Link></li>
        </ul>
      </nav>
      <Popup open={close} onClose={() => setclose(false)} closeOnDocumentClick={false} modal nested id='popup-1'>
        <div>
          <p>Are you sure?</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => cancel()} style={{ margin: '10px' }}>Cancel</button>
          <button onClick={Signout}>Ok</button>
        </div>
      </Popup>
      <div id='zi-1' style={{
        height: '100vh',
        position: 'relative',
      }}>
        <Outlet />
      </div>
    </div>
  )
}

export default Navigation
