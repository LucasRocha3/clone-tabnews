import database from "infra/database";
import { version } from "react";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
  );
  const databaseOpenedConnectionValue =
    databaseOpenedConnectionResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionValue,
      },
    },
  });
}

export default status;
