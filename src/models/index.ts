import { Sequelize } from 'sequelize';
import logger from '../logger';

export const sequelize = new Sequelize(process.env.SQL_DBNAME!, process.env.SQL_USERNAME!, process.env.SQL_PASSWORD, {
  host: process.env.SQL_HOST,
  dialect: 'mysql',
  logging: (msg) => logger.debug(msg)
});
