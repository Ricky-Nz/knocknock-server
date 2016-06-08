import { UserVouchers } from '../service/database';

UserVouchers.findAll()
	.then(address => console.log(address.map(({dataValues}) => dataValues)));
