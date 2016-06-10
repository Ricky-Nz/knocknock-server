import { getAddressByPostalCode } from '../service/location';

getAddressByPostalCode('048616')
	.then(result => console.log(result));
