import { OrderStatuses } from '../service/database';

OrderStatuses.findAll()
	.then(result => result.map(({dataValues}) => console.log(dataValues)));