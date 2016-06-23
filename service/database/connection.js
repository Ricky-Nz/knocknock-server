import Sequelize from 'sequelize';
import { RDS } from '../../config';

export default new Sequelize(RDS.test, RDS.username, RDS.password, {
  host: RDS.host,
  dialect: RDS.type,
  pool: RDS.pool,
  logging: false
});