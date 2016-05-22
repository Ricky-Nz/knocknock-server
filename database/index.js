import permission from './Permission';
import user from './User';
import cloth from './Cloth';
import clothCategory from './ClothCategory';

export function connect () {
	const options = { force: true };
	return user.sync(options)
		.then(() => permission.sync(options))
		.then(() => cloth.sync(options))
		.then(() => clothCategory.sync(options));
}

export const DBUser = user;
export const DBPermission = permission;
export const DBCloth = cloth;
export const DBClothCategory = clothCategory;