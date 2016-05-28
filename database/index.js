import permission from './Permission';
import user from './User';
import worker from './Worker';
import admin from './Admin';
import cloth from './Cloth';
import clothCategory from './ClothCategory';
import address from './Address';
import voucher from './Voucher';
import order from './Order';
import transaction from './Transaction';
import timeslot from './TimeSlot';
import factory from './Factory';
import wallet from './Wallet';

export function connect () {
	const options = { force: false };
	return user.sync(options)
		.then(() => worker.sync(options))
		.then(() => admin.sync(options))
		.then(() => address.sync(options))
		.then(() => permission.sync(options))
		.then(() => cloth.sync(options))
		.then(() => clothCategory.sync(options))
		.then(() => voucher.sync(options))
		.then(() => order.sync(options))
		.then(() => transaction.sync(options))
		.then(() => timeslot.sync(options))
		.then(() => factory.sync(options))
		.then(() => wallet.sync(options));
}

export const DBUser = user;
export const DBWorker = worker;
export const DBAdmin = admin;
export const DBAddress = address;
export const DBPermission = permission;
export const DBCloth = cloth;
export const DBClothCategory = clothCategory;
export const DBVoucher = voucher;
export const DBOrder = order;
export const DBTransaction = transaction;
export const DBTimeSlot = timeslot;
export const DBFactory = factory;
export const DBWallet = wallet;


