// external imports
import express from "express";

// internal imports
import { login, logout, sendVerificationMail, checkEmail, validateToken, changePass } from "../controllers/auth.mjs";

import createConnection from "../middleware/common/createConnection.mjs";

const authRouter = express.Router();

authRouter.post('/login', createConnection, login);
authRouter.delete('/logout', logout);
authRouter.post('/forgotPass', createConnection, checkEmail, sendVerificationMail);
authRouter.get('/tokenValidation/:token', createConnection, validateToken);
authRouter.put('/changePass', createConnection, changePass)

export default authRouter 

