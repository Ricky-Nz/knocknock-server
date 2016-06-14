import { UserCredits } from '../service/database';

UserCredits.findAll({order: 'created_on'})
	.then(result => result.map(({dataValues}) => console.log(dataValues)));