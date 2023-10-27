import pg from "pg";

const {
  POSTGRES_DBUSER,
  POSTGRES_DBPASS,
  POSTGRES_DBHOST,
  POSTGRES_DBPORT,
  POSTGRES_DBNAME,
} = process.env;

const config = {
  user: POSTGRES_DBUSER,
  password: POSTGRES_DBPASS,
  host: POSTGRES_DBHOST,
  port: POSTGRES_DBPORT,
  database: POSTGRES_DBNAME,
};

const pool = new pg.Pool(config);

export default pool;
