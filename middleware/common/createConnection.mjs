import pool from "../../app.mjs";

let createConnection = async (req, res, next) =>{
  try{
    const connection = await pool.getConnection();
    req.connection = connection;
    next();
  }catch(err){
    res.status(500).json({
      error: 'Internal server side problem'
    })
  }
}

export default createConnection