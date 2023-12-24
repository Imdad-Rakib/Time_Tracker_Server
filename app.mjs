// externel import
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'
import { createServer } from 'http';
import mysql from 'mysql2/promise';
// internal import
import { notFoundHandler, errorHandler } from './middleware/common/errorHandler.mjs';
import authRouter from './router/auth.mjs';
import signUpRouter from './router/signUp.mjs';
import createTables from './database/createTables.mjs';
import timeTrackerRouter from './router/timeTracker.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const app = express();
const server = createServer(app);

// database connection
let conn;
const pool = mysql.createPool({
  host: process.env.Db_Host,
  user: process.env.MySQL_UserName,
  password: process.env.MySQL_Pass,
  database: process.env.Db_Name,
  port: process.env.Db_Port,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
pool.getConnection()
.then((connection)=>{
  conn = connection;
  createTables(connection);
})
.catch((err)=>{
  alert('An error occured. Please try again.')
})
.finally(()=>{
  conn.release();
})

// req parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    // origin: `http://localhost:${process.env.CLIENT_PORT}`,
    origin: 'https://6587b600b2a7d7f9e64e8b37--glowing-gecko-958940.netlify.app',
    // origin: '*', // using this one prevents from setting cookies in client side
    credentials: true
  })
)

//set static folder
app.use(express.static(path.join(__dirname, 'public')));


//parse cookies

app.use(cookieParser(process.env.COOKIE_SECRET));

//routing setup

app.use('/auth', authRouter);
app.use('/signUp', signUpRouter);
app.use('/timeTracking', timeTrackerRouter);

//404 not found handler
app.use(notFoundHandler)

// common error handler
app.use(errorHandler)

server.listen(process.env.PORT || 5000, () => {
  // console.log(`Server running at port ${process.env.PORT}...`)
})

export default pool;