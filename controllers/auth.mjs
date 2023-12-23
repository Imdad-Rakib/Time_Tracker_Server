// external imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// internal imports
import { sendEmail } from "../utilities/nodemailerSetup.mjs";


async function checkEmail(req, res, next) {
    const connection = req.connection;
    try {
        const [user] = await connection.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);

        if (user.length) next();
        else{
            res.status(404).json({
                error: 'Email not found'
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal server error. Please try again'
        })
    }
}

async function changePass(req, res, next){
    const connection = req.connection;
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await connection.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, req.body.email]);
        res.status(200).json({
            success: true
        })
    }catch(error){
        console.log(err);
        res.status(500).json({
            error: 'Internal server error. Please try again'
        })
    }finally{
        connection.release();
    }
}

async function validateToken(req, res, next) {
    const connection = req.connection;
    try {
        const [user] = await connection.execute('SELECT * FROM passResetToken WHERE token = ?', [req.params.token])
        if (user.length){
            await connection.execute('DELETE FROM passResetToken WHERE token = ?', [req.params.token])
            res.redirect(`http://localhost:${process.env.CLIENT_PORT}/resetpassword`)
        }
        else {
            res.redirect(`http://localhost:${process.env.CLIENT_PORT}/blank`)
        }
    } catch (error) {
        console.log(err);
        res.status(500).json({
            error: 'An error occured. Please try again'
        })
    }finally{
        connection.release();
    }
}

async function sendVerificationMail(req, res, next) {
    const connection = req.connection;
    try {
        const token = await bcrypt.hash(req.body.email, 5);
        const uriEncodedToken = encodeURIComponent(token);
        await connection.execute('DELETE FROM passResetToken WHERE email = ?', [req.body.email])
        await connection.execute(`INSERT INTO passResetToken (email, token) VALUES (?, ?)`, [req.body.email, token]);
        let url = `https://time-tracker-api-6mlb.onrender.com/auth/tokenValidation/${uriEncodedToken}`;
        let isEmailSent = await sendEmail(process.env.EMAIL, process.env.KEY, req.body.email, url, 'Password Reset');
        if (isEmailSent) {
            res.status(200).json({
                success: true
            })
        }
        else throw Error("Couldn't send email");
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal server error. Please try again'
        })
    }finally{
        connection.release();
    }
}

async function login(req, res, next) {
    const connection = req.connection;
    try {
        const [users]  = await connection.execute('SELECT * FROM users WHERE email = ?', [req.body.email])
        if (users.length) {
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                users[0].password
            );
            if (isValidPassword) {
                const userObject = {
                    id: users[0].id,
                    name: users[0].name,
                    email: users[0].email,
                };

                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY,
                });
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true,
                    domain: 'time-tracker-api-6mlb.onrender.com',
                    path: '/',
                    sameSite: 'None',
                    secure: true,
                })
                res.status(200).json({
                    id: userObject.id,
                    name: userObject.name
                });
            } else {
                res.status(401).json({
                    error: 'Invalid email or password'
                })
            }
        } else {
            res.json({
                error: 'Invalid email or password'
            })
        }
    }catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal server error. Please try again.'
        })
    }finally{
        connection.release();
    }
}


function logout(req, res) {
    try{
        res.clearCookie(process.env.COOKIE_NAME);
        res.status(200).json({
            success:true
        })
    }catch(err){
        res.status(500).json({
            error: 'Internal sever error. Please try again.'
        });
    }
}

export{
    login,
    logout,
    checkEmail,
    sendVerificationMail,
    validateToken,
    changePass
};
