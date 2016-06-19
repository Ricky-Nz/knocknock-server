export default {
	rds: {
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
	},
	stripe: {
		secret: 'sk_test_TXuRIWwqiRZq4PgtAdlL14wp'
	}
};