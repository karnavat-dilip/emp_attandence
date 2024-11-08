import express from 'express'
import multer from 'multer';
import path from 'path';
import { Addemployee, CheckInEmployee, CheckOutEmployee, Createaccount, empdelete,Sendmail, ForgotPassword, getcheckInusers, getcheckOutusers, getempbyid, getemployeedata, LogIn, LogOut, Updateemployee, verifyToken, sendfile } from './Routes.js'
const Router = express.Router()

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
    },
});
// File filter to accept only PNG files
const fileFilter = (req, file, cb) => {
    // Check file extension
    
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (ext === '.png' || ext === '.jpeg') {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only PNG and JPG files are allowed'), false); // Reject the file
    }
  };
  
const upload = multer({ 
    storage:storage,
    fileFilter:fileFilter
 });

Router.get('/empdata', verifyToken, getemployeedata)
Router.get('/getcheckin', verifyToken, getcheckInusers)
Router.get('/getempbyid/:id', verifyToken, getempbyid)
Router.get('/getcheckout', verifyToken, getcheckOutusers)
Router.post('/CheckInemployee', CheckInEmployee)
Router.post('/CheckOutemployee', CheckOutEmployee)
Router.post('/Sendmail', Sendmail)
Router.post('/Forget', ForgotPassword)
Router.post('/Signup', Createaccount)
Router.post('/Addemployee', upload.single('imgprofile'), Addemployee)
Router.put('/updateemployee/:id', upload.single('imgprofile'), Updateemployee)
Router.post('/SignIn', LogIn)
Router.get('/SignOut', LogOut)
Router.delete('/empdelete/:id', empdelete)
Router.get('/',sendfile)


export default Router