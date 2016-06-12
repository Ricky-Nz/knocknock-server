import { LaundryTypes } from '../service/database';

LaundryTypes.findAll()
	.then(result => result.map(({dataValues}) => console.log(dataValues)));
