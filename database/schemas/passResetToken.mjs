const createPassResetTokenTable = async (connection) => {
  const sql = `CREATE TABLE IF NOT EXISTS passResetToken (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`
  try {
    await connection.execute(sql);
  } catch (err) {
    console.log(err);
  }
}
export default createPassResetTokenTable;