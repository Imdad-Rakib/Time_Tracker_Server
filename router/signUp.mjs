// external imports
import express from "express";

// internal imports
import { sendVerificationMail, addUser, checkEmail, validateToken } from "../controllers/signUp.mjs";
import createConnection from "../middleware/common/createConnection.mjs";

const signUpRouter = express.Router();

signUpRouter.get('/tokenValidation/:token', createConnection, validateToken, addUser);
signUpRouter.post('/validateEmail', createConnection, checkEmail, sendVerificationMail);

export default signUpRouter;

