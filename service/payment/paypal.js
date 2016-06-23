import request from 'request';
import qs from 'querystring';
import { PAYPAL } from '../../config';

export function requestPaypalExpressUrl({
	amount,
	currency,
	params
}) {
	return new Promise(function (resolve, reject) {
		request.post({
			url: PAYPAL.hostUrl,
			form: {
				...PAYPAL.params,
				METHOD: 'SetExpressCheckout',
				PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
				PAYMENTREQUEST_0_AMT: amount,
				PAYMENTREQUEST_0_CURRENCYCODE: currency,
				RETURNURL: `${PAYPAL.successRedirect}${params?('?'+qs.stringify(params)):''}`,
				CANCELURL: PAYPAL.failureRedirect
			}
		}, (err, res, body) => {
			if (err || !body) return reject(err||'failed');
			try {
				const result = qs.parse(body);
				if (!result.TOKEN) return reject('failed');

				resolve({
					token: result.TOKEN,
					url: `${PAYPAL.authorizeUrlRoot}${result.TOKEN}`
				});
			} catch (err) {
				reject(err);
			}
		});
	});
}

export function completePaypalExpressPayment({
	PayerID,
	token
}) {
	return new Promise(function (resolve, reject) {
		request.post({
			url: PAYPAL.hostUrl,
			form: {
				...PAYPAL.params,
				METHOD: 'GetExpressCheckoutDetails',
				TOKEN: token
			}
		}, (err, res, body) => {
			if (err || !body) return reject(err||'failed');
			try {
				const result = qs.parse(body);
				if (result.ACK!=='Success' || !result.PAYMENTREQUEST_0_CURRENCYCODE || !result.PAYMENTREQUEST_0_AMT) {
					return reject('payment failed');
				}

				request.post({
					url: PAYPAL.hostUrl,
					form: {
						...PAYPAL.params,
						METHOD: 'DoExpressCheckoutPayment',
						TOKEN: token,
						PAYERID: PayerID,
						PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
						PAYMENTREQUEST_0_AMT: result.PAYMENTREQUEST_0_AMT,
						PAYMENTREQUEST_0_CURRENCYCODE: result.PAYMENTREQUEST_0_CURRENCYCODE
					}
				}, (err, res, body) => {
					if (err || !body) return reject(err||'failed');

					try {
						const result = qs.parse(body);
						if (result.ACK!=='Success') return reject('payment failed');

						resolve({
							token: result.TOKEN,
							amount: result.PAYMENTINFO_0_AMT,
							currency: result.PAYMENTINFO_0_CURRENCYCODE,
							refNo: result.CORRELATIONID
						});
					} catch (err) {
						reject(err);
					}
				});
			} catch (err) {
				reject(err);
			}
		});
	});
}