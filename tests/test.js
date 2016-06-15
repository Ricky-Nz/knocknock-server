import { BlockedTimes } from '../service/database';

BlockedTimes.findAll()
	.then(result => result.map(({dataValues}) => console.log(dataValues)));