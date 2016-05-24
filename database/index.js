import permission from './Permission';
import user from './User';
import cloth from './Cloth';
import clothCategory from './ClothCategory';
import address from './Address';

export function connect () {
	const options = { force: false };
	return user.sync(options)
		.then(() => address.sync(options))
		.then(() => permission.sync(options))
		.then(() => cloth.sync(options))
		.then(() => clothCategory.sync(options));
}

export const DBUser = user;
export const DBAddress = address;
export const DBPermission = permission;
export const DBCloth = cloth;
export const DBClothCategory = clothCategory;