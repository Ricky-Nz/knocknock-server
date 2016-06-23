import { Orders, OrderTransactions, UserVouchers, PromoCodes } from '../service/database';

export function processOrderPayment({userId, orderId, voucherId, promoCodeId}, makePayment) {
	const {id: localOrderId} = fromGlobalId(orderId);

	return new Promise((resolve, reject) => {
			if (voucherId) {
				const {id: localVoucherId} = fromGlobalId(voucherId);
				UserVouchers.findById(localVoucherId)
					.then(userVoucher => {
						if (!userVoucher) return reject('voucher not found');
						if (userVoucher.user_id !== userId) return reject('permission check failed');
						if (userVoucher.used) return reject('voucher already used');

						Vouchers.findById(userVoucher.voucher_id)
							.then(voucher => {
								if (!voucher) return reject('voucher not found');
								if (voucher.disabled) return reject('voucher disabled');
								if (new Date(voucher.expire_on) < new Date()) return reject('voucher expired');

								resolve(voucher);
							})
							.catch(err => reject('coucher not found'))
					})
					.catch(err => reject('voucher not found'));
			} else {
				resolve(null);
			}
		})
		.then(voucher =>
			new Promise((resolve, reject) => {
				if (promoCodeId) {
					const {id: localPromoCodeId} = fromGlobalId(promoCodeId);
					PromoCodes.findById(localPromoCodeId)
						.then(promocode => {
							if (!promocode) return reject('promocode not found');
							if (new Date(promocode.start_date) > new Date()) return reject('promotion not started yet');
							if (new Date(promocode.end_date) < new Date()) return reject('promotion already finished');

							resolve({voucher: promocode});
						})
						.catch(err => reject(err))
				} else {
					resolve({voucher, promocode: null});
				}
			})
		)
		.then(({voucher, promocode}) => (
			Orders.findById(localOrderId)
				.then(order => {
					if (!order) throw 'order not found';
					if (order.paid) throw 'order already paid';
					if (!order.to_pay_price || isNaN(order.to_pay_price)) throw 'order price is empty or incorrect';

					const originalPrice = formatPrice(order.to_pay_price);
					let voucherDiscount = 0;
					let promocodeDiscount = 0;
					if (voucher) {
						if (isNaN(voucher.value)) throw 'illegal voucher: value not correct';

						voucherDiscount = formatPrice(voucher.value);
					}
					if (promocode) {
						if (promocode.promo_type === 1) {
							if (isNaN(promocode.flat_discount)) throw 'illegal promocode: value not correct';

							promocodeDiscount = formatPrice(promocode.flat_discount)
						} else if (promocode.promo_type === 0) {
							if (isNaN(promocode.discount_percent)
								|| parseFloat(promocode.discount_percent) > 100
								|| parseFloat(promocode.discount_percent) < 0) throw 'illegal promocode: value not correct';

							promocodeDiscount = formatPrice(originalPrice * parseFloat(promocode.discount_percent) / 100);
						} else {
							throw 'promo type not supported';
						}
					}

					return {
						voucher,
						promocode,
						originalPrice,
						voucherDiscount,
						promocodeDiscount,
						toPayPrice: formatPrice(originalPrice - voucherDiscount - promocodeDiscount)
					};
				})
		))
		.then(({voucher, promocode, originalPrice, voucherDiscount, promocodeDiscount, toPayPrice}) => {
				return makePayment({localOrderId, toPayPrice})
					.then(({success, paymentMode, paymentRefToken}) => {
						if (!success) return reject('payment failed');

						return OrderTransactions.create({
							  user_id: userId,
							  order_ids: localOrderId,
							  voucher_ids: voucher&&voucher.id,
							  promo_code_id: promocode&&promocode.id,
							  total_promo_discount: formatPrice(promocodeDiscount, true),
							  original_amount: formatPrice(originalPrice, true),
							  payable_amount: formatPrice(toPayPrice, true),
							  payment_mode: paymentMode,
							  payment_ref_token: paymentRefToken,
							  created_at: new Date(),
							  total_voucher_amount: formatPrice(voucherDiscount, true)
							})
					})
					.then(() => Orders.update({paid: true}, {where:{id: localOrderId}}));
		})
		.then(() => ({localOrderId}));
}