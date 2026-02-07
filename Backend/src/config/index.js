import 'dotenv/config';

const config = {
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  SECRET: process.env.SECRET 
};

export default config;
export const { DB_USER, DB_PASS } = config;
