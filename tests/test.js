import { UserCredits } from '../service/database';

UserCredits.findAll()
	.then(result => result.map(({dataValues}) => console.log(dataValues.status)));
