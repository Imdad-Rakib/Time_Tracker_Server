
const createUserTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;
  try{
    await connection.execute(sql);
  }catch(err){
    console.log(err);
  }
};
export default createUserTable;
