// external imports
import bcrypt from 'bcrypt'

// internal imports
import { sendEmail } from "../utilities/nodemailerSetup.mjs";


async function checkEmail(req, res, next) {
    const connection = req.connection;
    try {
        const [user] = await connection.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);

        if (user.length) {
            res.status(422).json({
                error: 'This email is already in use. Try different.'
            })
        }
        else next();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal server error. Please try again'
        })
    }
}


async function sendVerificationMail(req, res, next) {
    const connection = req.connection;
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const token = await bcrypt.hash(req.body.email, 5);
        const uriEncodedToken = encodeURIComponent(token);
        await connection.execute('DELETE FROM tempToken WHERE email = ?', [req.body.email]);
        await connection.execute(`INSERT INTO tempToken (name, email, password, token) VALUES (?, ?, ?, ?)`, [req.body.name, req.body.email, hashedPassword, token]);
        let url = `https://time-tracker-api-6mlb.onrender.com/signUp/tokenValidation/${uriEncodedToken}`;
        let isEmailSent = await sendEmail(process.env.EMAIL, process.env.KEY, req.body.email, url, 'Email Verification');
        if(isEmailSent){
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
    }
    connection.release();
}
async function validateToken(req, res, next) {
    const connection = req.connection;
    try{
        const [user] = await connection.execute('SELECT * FROM tempToken WHERE token = ?', [req.params.token])
        if(user.length){
            await connection.execute('DELETE FROM tempToken WHERE token = ?', [req.params.token])
            res.locals.user = user[0];
            next();
        }
        else{
            res.redirect(`http://localhost:${process.env.CLIENT_PORT}/blank`)
        }
    }catch(error){
        console.log(err);
        res.status(500).json({
            error: 'An error occured. Please try again'
        })
    }
}
async function addUser(req, res, next) {
    const connection = req.connection;
    try{
        const {name, email, password} = res.locals.user;
        await connection.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
        res.redirect(`http://localhost:${process.env.CLIENT_PORT}/success`)

    }catch(err){
        console.log(err);
        res.status(500).json({
            error: 'An error occured. Please try again'
        })
    }finally{
        await connection.release();
    }
}
export { sendVerificationMail, addUser, checkEmail, validateToken};