import { Orders } from '../service/database';

Orders.findAll()
	.then(result => result.map(({dataValues}) => console.log(dataValues.id)));
