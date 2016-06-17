import request from 'request';

export function getAddressByPostalCode(postalCode) {
	return new Promise(function (resolve) {
		request({
			uri: 'http://maps.apps-bus.com/api/Places/SearchPlace',
			qs: {
				query: postalCode,
				page: 1
			},
			json: true
		}, (err, res, body) => {
			if (!body||!body.Data[0]) {
				return resolve(null);
			}

			const x = body.Data[0].XCoordinate;
			const y = body.Data[0].YCoordinate;

			request({
				uri: 'http://www.onemap.sg/API/services.svc/revgeocode',
				qs: {
					token: 'qo/s2TnSUmfLz+32CvLC4RMVkzEFYjxqyti1KhByvEacEdMWBpCuSSQ+IFRT84QjGPBCuz/cBom8PfSm3GjEsGc8PkdEEOEr',
					location: `${x},${y}`,
					buffer: 200
				},
				json: true
			}, (err, res, body) => {
				if (!body || !body.GeocodeInfo) {
					return resolve(null);
				}

				for(const index in body.GeocodeInfo) {
					const address = body.GeocodeInfo[index];
					if (address['POSTALCODE'] == postalCode) {
						return resolve(`${address['BUILDINGNAME']}, BLOCK ${address['BLOCK']}`);
					}
				}

				return resolve(null);
			});
		});
	});
}