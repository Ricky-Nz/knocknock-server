import viewer from './Viewer';
import permission from './Permission';
import user from './User';
import laundrycloth from './LaundryCloth';
import laundryorder from './LaundryOrder';
import record from './Record';
import config from '../config';

export function connect () {
	const options = { force: config.reset };
	return user.sync(options)
		.then(() => permission.sync(options))
		.then(() => laundrycloth.sync(options))
		.then(() => laundryorder.sync(options))
		.then(() => record.sync(options));
}

export const DBUser = user;
export const DBPermission = permission;
export const DBLaundryCloth = laundrycloth;
export const DBLaundryOrder = laundryorder;
export const DBRecord = record;
export const DBViewer = viewer;