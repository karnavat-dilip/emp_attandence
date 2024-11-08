import express from 'express';
import db from "./Modal.js"
import crypto from 'crypto';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hashData(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}
// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']; // Get token from Authorization header

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate.' });
        }

        // If token is valid, decoded data will contain the user info
        req.user = decoded; // Attach decoded user data to the request object

        next();
    });
}
const privateKey = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Key length
    publicKeyEncoding: {
        type: 'pkcs1', // RSA public key format
        format: 'pem' // PEM format
    },
    privateKeyEncoding: {
        type: 'pkcs1', // RSA private key format
        format: 'pem' // PEM format
    }
}).privateKey;

const sendfile=(req,res)=>{
    res.sendFile(path.join(__dirname, '../front-end/build', 'index.html'));
}

const getemployeedata = (req, res) => {

    db.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results);
    });
}

const CheckInEmployee = (req, res) => {
    const { empcode, datetime, empsign, Reason } = req.body;
    console.log(empcode);

    console.log(datetime);

    const sql = `INSERT INTO checkin (Emp_Code, Emp_Img, Emp_Name, Emp_Current_Date, Emp_Reason, Emp_Signature) SELECT e.Emp_Id, e.Emp_Img, e.Emp_Nm, ?, ?, ? FROM employee e WHERE e.Emp_Id = ? `;


    const query = 'SELECT COUNT(*) AS count FROM checkin WHERE Emp_Code = ?';
    db.query(query, [empcode], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const chkout = 'DELETE FROM checkout WHERE Emp_Code = ?'
        db.query(chkout, [empcode], (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} record(s)`);
        });
        const count = results[0].count;

        // If count is 0, the username doesn't exist
        // If count is greater than 0, the username already exists
        const isUsernameAvailable = count === 0;
        console.log(isUsernameAvailable);
        if (!isUsernameAvailable) {
            return res.status(500).json({ message: 'Already CheckIn!' });


        } else {
            db.query(sql, [datetime, Reason, empsign, empcode], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).send('Error inserting data');
                } else {
                    res.send('CheckIn successfully');
                }

            });
        }
    });
}
const CheckOutEmployee = (req, res) => {
    const { empcode, datetime, empsign, Reason } = req.body;
    console.log(datetime);

    const sql = `INSERT INTO checkout (Emp_Code, Emp_Img, Emp_Name, Emp_Current_Date, Emp_Reason, Emp_Signature) SELECT e.Emp_Id, e.Emp_Img, e.Emp_Nm, ?, ?, ? FROM employee e WHERE e.Emp_Id = ? `;


    const query = 'SELECT COUNT(*) AS count FROM checkout WHERE Emp_Code = ?';
    db.query(query, [empcode], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const chkin = 'DELETE FROM checkin WHERE Emp_Code = ?'
        db.query(chkin, [empcode], (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} record(s)`);
        });

        const count = results[0].count;

        // If count is 0, the username doesn't exist
        // If count is greater than 0, the username already exists
        const isUsernameAvailable = count === 0;
        console.log(isUsernameAvailable);
        if (!isUsernameAvailable) {
            return res.status(500).json({ message: 'Already CheckOut!' });


        } else {
            db.query(sql, [datetime, Reason, empsign, empcode], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).send('Error inserting data');
                } else {
                    res.send('Checkout successfully!');
                }

            });
        }
    });
}
const getcheckInusers = (req, res) => {
    db.query('SELECT * FROM checkin', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results);
    });
}
const getcheckOutusers = (req, res) => {
    db.query('SELECT * FROM checkout', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results);
    });
}
const Createaccount = (req, res) => {
    const { id, password, username } = req.body;
    const hashedData = hashData(password);

    const sql = 'INSERT INTO signup (Id,username,Password) VALUES (?,?,?)';
    const query = 'SELECT COUNT(*) AS count FROM signup WHERE username=?'

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error(err)
        }
        const count = results[0].count

        if (count > 0) {
            return res.status(500).json({ message: 'Username already exist!' });

        } else {
            db.query(sql, [id, username, hashedData], (err, results) => {
                if (err) {
                    console.error(err)
                }

                res.json(results)
            })
        }


    })
}

const LogIn = (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM signup WHERE username=? AND Password=?';
    const hashpassword = hashData(password)
    console.log(username, password);
    console.log(hashpassword);

    db.query(sql, [username, hashpassword], (err, result) => {

        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
        console.log(result, 'result');

        if (result.length > 0) {
            console.log(result);
            const username = result[0].username;

            const token = jwt.sign({ username }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });


            res.cookie('token', token)
            return res.status(200).json({ Status: 'Success', token })

        } else {
            return res.json({ Message: 'Invalid Credential!' });
        }


    })
}

const Addemployee = async (req, res) => {
    const { empCode, profile, empName } = req.body

    try {
        const sql = 'INSERT INTO `employee`(`Emp_Id`, `Emp_Img`, `Emp_Nm`) VALUES (?,?,?)'

        db.query(sql, [empCode, req.file.filename, empName], (err, results) => {
            if (err) {
                console.error(err)
            }

            res.status(200).json({ message: 'Employee Added successfully!' });
        })

    } catch (error) {
        res.status(500).json({ message: 'Invalid file format!' });
    }
}

const Updateemployee = async (req, res) => {
    const { empCode, profile, empName } = req.body;
    const { id } = req.params

    try {
        const sql = `UPDATE employee SET Emp_Img= ${JSON.stringify(req.file.filename)},Emp_Nm= ${JSON.stringify(empName)} WHERE Emp_Id= ${JSON.stringify(id)}`

        db.query(sql, (err, results) => {
            if (err) {
                console.error(err)
            }

            res.status(200).json({ message: 'Employee Updated successfully!' });

        })

    } catch (error) {
        res.status(500).json({ message: 'Invalid file format!' });
    }
}

const getempbyid = (req, res) => {
    const { id } = req.params
    console.log(id);


    db.query(`SELECT * FROM employee WHERE Emp_Id = ${JSON.stringify(id)}`, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results);
    });
}
const LogOut = (req, res) => {
    res.clearCookie('token');
    res.json('Cookie cleared');
}
const empdelete = (req, res) => {
    const { id } = req.params
    console.log(id, 'idd');

    const sql = `DELETE FROM employee WHERE Emp_Id = ${JSON.stringify(id)}`

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Server Error');
            return;
        }

        const chkin = 'DELETE FROM checkin WHERE Emp_Code = ?'
        db.query(chkin, [id], (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} record(s)`);
        });

        const chkout = 'DELETE FROM checkout WHERE Emp_Code = ?'
        db.query(chkout, [id], (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} record(s)`);
        });

        res.status(200).send({ message: "Item deleted successfully" });

    })
}
const Sendmail = (req, res) => {
    const { email } = req.body;
    console.log(email);

    const sql = `SELECT Id FROM signup WHERE username=${JSON.stringify(email)}`

    const query = 'SELECT COUNT(*) AS count FROM signup WHERE username=?'
    try {
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error(err)
            }
            const count = results[0].count
            console.log(count);

            db.query(sql, (err, results) => {
                if (err) {
                    console.error('Error fetching data:', err);
                    res.status(500).send('Server Error');
                    return;
                }

                if (count > 0) {
                    // Create a transporter object
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',  // You can use other services like 'yahoo', 'outlook', or configure a custom SMTP
                        auth: {
                            user: 'gujaratpanel@gmail.com',  // Your email
                            pass: 'yhiw fwql wcwu elrq'    // Your email password or app-specific password
                        }
                    });

                    // Setup email data
                    const mailOptions = {
                        from: 'gujaratpanel@gmail.com',      // Sender's email
                        to: email,       // List of recipients (can be comma-separated for multiple)
                        subject: 'Hello from Pcube Software solution',     // Subject line
                        text: 'Now you can reset your password',  // Plain text body
                        html: `
                        <div>
                    <b>Now you can reset your password for your account ${email}.</b><br></br>
                    <a href="http://localhost:3000/resetpassword/${results[0].Id}"><button style={{    padding: 12px;
                        margin: 13px
                        background-color: cadetblue;
                        color: white;
                        border: none;
                        cursor: pointer;
                        position: relative;
                        left: 100px;}}>Forgot Password</button></a>
                    </div>
                    `  // HTML body (optional)
                    };

                    // Send the email
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log('Error while sending email: ', error);
                        }

                        return res.status(200).json({ message: 'Email Send Successfully!' });

                    });
                } else {
                    return res.status(500).json({ message: 'Email does not exist or not active!' });
                }
            })
        })

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong!' });
    }
}
const ForgotPassword = (req, res) => {
    const { id, Password } = req.body;
    console.log(id);

    const hashedData = hashData(Password);
    const sql = `UPDATE signup SET Password=${JSON.stringify(hashedData)} WHERE Id=${JSON.stringify(id)}`


    try {
        db.query(sql, (err, result) => {
            if (err) {
                return console.error(err);
            }
            return res.status(200).json({ message: 'Password Changed Successfully!' })
        })
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong!' })
    }

}
export { getemployeedata, CheckInEmployee, CheckOutEmployee, empdelete, Sendmail, ForgotPassword, getcheckInusers, Updateemployee, getcheckOutusers, Createaccount, LogIn, LogOut, verifyToken, Addemployee, getempbyid,sendfile }