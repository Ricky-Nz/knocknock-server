import { DBUserAddresses } from '../service/database';

DBUserAddresses.findOne({attributes: ['id', 'user_id', 'contact_no', 'unit_number', 'name', 'address', 'postal_code', 'apartment_type', 'district_id', 'note', 'created_on']})
	.then(address => console.log(address));
