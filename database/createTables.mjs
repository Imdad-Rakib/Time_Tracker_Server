//internal imports
import createUserTable from "./schemas/users.mjs"
import createTempTokenTable from "./schemas/tempToken.mjs"
import createPassResetTokenTable from "./schemas/passResetToken.mjs";
import createWorkScheduleTable from "./schemas/workSchedule.mjs";

const createTables = (connection) =>{
  createUserTable(connection);
  createTempTokenTable(connection);
  createPassResetTokenTable(connection);
  createWorkScheduleTable(connection);
}

export default createTables;