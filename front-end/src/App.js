import react, { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from './Components/Login';
import CheckIn from './Components/CheckIn';
import Checkout from './Components/Checkout';
import Signup from './Components/Signup';
import Checkintable from './Components/Checkintable';
import { SiGsk } from 'react-icons/si';
import Checkouttable from './Components/Checkouttable';
import Navigation from './Components/Navigation';
import Allemployee from './Components/Allemployee';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';

function App() {
  const [isauthenticated, setisauthenticated] = useState(JSON.parse(localStorage.getItem('authvalue')))
    
  return (
    <react.Fragment>
      <BrowserRouter>
        <Routes>

          <Route path='/login' element={<Login setisauthenticated={setisauthenticated} />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/resetpassword/:id' element={<ResetPassword />} />

          <Route path='/' element={isauthenticated ? <Navigation setisauthenticated={setisauthenticated} /> : <Navigate to='/login' />}>
            <Route path='/' element={<Allemployee />} />
            <Route path='/Check' element={<CheckIn />} />
            {/* <Route path='/Checkout' element={<Checkout />} /> */}
            <Route path='/Checkin' element={<Checkintable />} />
            <Route path='/Checkout' element={<Checkouttable />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </react.Fragment>
  );
}

export default App;
