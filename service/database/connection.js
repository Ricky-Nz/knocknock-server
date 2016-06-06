import Sequelize from 'sequelize';
import config from '../config';

const db = config.db;

export default new Sequelize(db.test, db.username, db.password, {
  host: db.host,
  dialect: db.type,
  pool: db.pool
});