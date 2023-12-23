//external imports
import { format } from "date-fns";



const createNewEntry = async (req, res, next) =>{
  const connection = req.connection;
  try{
    const [rows] = await connection.execute(`SELECT * FROM workSchedule WHERE date = ? AND user_id = ?`, [req.body.date, req.user.id]);
    if(rows.length){
      res.status(422).json({
        error: "An entry for this date already exists."
      })
    }
    else{
      const {date, start_time, end_time, notes} = req.body;
      let [year, month, day] = date.split('-');
      year = parseInt(year, 10);
      month = parseInt(month, 10);
      day = parseInt(day, 10);
      const dayName = format(new Date(year, month - 1, day), 'EEE');
      await connection.execute(`INSERT INTO workSchedule (user_id, date, day, start_time, end_time, notes) VALUES (?, ?, ?, ?, ?, ?)`, [req.user.id, date, dayName, start_time, end_time, notes]);
      res.status(200).json({
        success: true
      });
    }
  }catch(err){
    console.log(err);
    res.status(500).json({
      error: "Internal server error. Please try again."
    })
  }finally{
    connection.release();
  }
}
const updateRequest = async (req, res, next) =>{
  const connection = req.connection;
  try{
    let [rows] = await connection.execute(`SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, start_time, end_time, notes FROM workSchedule WHERE user_id = ? AND date = ?`, [req.user.id, req.params.date]);
    if (rows.length) {
      res.status(200).json(rows[0]);
    }
    else{
      res.status(404).json({
        error: "No entry found for the date."
      })
    } 
  }catch(err){
    console.log(err);
    res.status(500).json({
      error: "Internal server error. Please try again."
    })
  }finally{
    connection.release();
  }
}
const updateEntry = async (req, res, next) =>{
  const connection = req.connection;
  try{
    let {date, start_time, end_time, notes } = req.body;
    await connection.execute('UPDATE workSchedule SET start_time = ?, end_time = ?, notes = ? WHERE user_id = ? AND date = ?', [start_time, end_time, notes, req.user.id, date]);
    res.status(200).json({
      success: true
    })
  }catch(err){
    console.log(err);
    res.status(500).json({
      error: "Internal server error. Please try again."
    })
  }finally{
    connection.release();
  }
}
const deleteEntry = async (req, res, next) =>{
  const connection = req.connection;
  try{
    const [rows] = await connection.execute('SELECT * FROM workSchedule WHERE user_id = ? AND date = ?', [req.user.id, req.params.date]);
    if(rows.length){
      await connection.execute('DELETE FROM workSchedule WHERE user_id = ? AND date = ?', [req.user.id, req.params.date]);
      res.status(200).json({
        success: true
      })
    }
    else{
      res.status(404).json({
        error: 'No entry found to delete for this date'
      })
    }
  }catch(err){
    console.log(err);
    res.status(500).json({
      error: "Internal server error. Please try again."
    })
  }finally{
    connection.release();
  }
}
const getWeeklyReport= async (req, res, next) => {
  const connection = req.connection;
  try{
    const sql =
    `SELECT WEEK(date) AS week, DATE_FORMAT(date, '%Y-%m-%d') AS date, day, start_time, end_time, TIME_TO_SEC(TIMEDIFF(end_time, start_time)) AS total_duration, notes
    FROM workSchedule
    WHERE user_id = ?
    ORDER BY week DESC, date ASC
    `;
    const [rows] = await connection.execute(sql, [req.user.id]);
    // console.log(rows);
    let report = [];
    for(let i = 0; i < rows.length;){
      let currentWeek = rows[i].week;
      let j = i;
      let weeklyReport = [];
      while(j < rows.length && rows[j].week === currentWeek){
        weeklyReport.push(rows[j]);
        j++;
      }
      report.push(weeklyReport);
      i = j;
    }
    res.status(200).json({
      report
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      error: "Internal server error. Please try again."
    })
  }finally{
    connection.release();
  }
}
export {createNewEntry, getWeeklyReport, updateEntry, updateRequest, deleteEntry}