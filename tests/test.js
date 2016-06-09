import { Orders } from '../service/database';

let date = new Date();
date.setHours(8);
date.setMinutes(0);
date.setSeconds(0);
date.setMilliseconds(0);

Orders.findAll()
	.then(address => console.log(address.map(({dataValues}) => dataValues)));
