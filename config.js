export const RDS = {
	reset: false,
	host: 'test2.cktsz52qq75y.ap-southeast-1.rds.amazonaws.com',
	type: 'postgres',
	username: 'postgres',
	password: '0293248094',
	production: 'knocknock',
	test: 'knocknock',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
};

export const STRIPE = {
	secret: 'sk_test_TXuRIWwqiRZq4PgtAdlL14wp'
};

export const PAYPAL = {
	hostUrl: 'https://api-3t.sandbox.paypal.com/nvp',
	authorizeUrlRoot:  'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=',
	successRedirect: 'http://localhost:8080/payment/success',
	failureRedirect: 'http://localhost:8080/payment/failure',
	params: {
		USER: 'ruqisell_api1.gmail.com',
		PWD: 'HYT96TFHW4VXNTBH',
		SIGNATURE: 'AGOvrFVaPGsFHHwYehi0Fe4P6AAxAGT0bEGv-2DB-bMJCmWR0iA5LquA',
		VERSION: 93
	}
};