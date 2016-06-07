import Sequelize from 'sequelize';
import config from '../../config';

const db = config.rds;

export default new Sequelize(db.test, db.username, db.password, {
  host: db.host,
  dialect: db.type,
  pool: db.pool
});