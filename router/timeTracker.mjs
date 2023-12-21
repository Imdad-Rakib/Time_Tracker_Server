// external imports
import express from "express";

// internal imports
import { checkLogin } from "../middleware/common/checkLogin.mjs";
import { createNewEntry, getWeeklyReport, updateEntry, updateRequest, deleteEntry } from "../controllers/timeTracker.mjs";
import createConnection from "../middleware/common/createConnection.mjs";


const timeTrackerRouter = express.Router();

timeTrackerRouter.post('/newEntry', checkLogin, createConnection, createNewEntry);
timeTrackerRouter.get('/report', checkLogin, createConnection, getWeeklyReport);
timeTrackerRouter.get('/updateReq/:date', checkLogin, createConnection, updateRequest);
timeTrackerRouter.put('/updateEntry', checkLogin, createConnection, updateEntry);
timeTrackerRouter.delete('/deleteEntry/:date', checkLogin, createConnection, deleteEntry);

export default timeTrackerRouter;

