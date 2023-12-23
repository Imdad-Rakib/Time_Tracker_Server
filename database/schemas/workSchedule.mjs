
const createWorkScheduleTable = async (connection) => {
  const sql = `CREATE TABLE IF NOT EXISTS workSchedule( 
        user_id INT,
        date DATE,
        day VARCHAR(60) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        notes VARCHAR(60),
        PRIMARY KEY (user_id, date),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;
  try {
    await connection.execute(sql);
  } catch (err) {
    console.log(err);
  }
};
export default createWorkScheduleTable;
