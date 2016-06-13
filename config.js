export default {
	db: {
		reset: true,
		host: '104.155.202.12',
		type: 'mysql',
		username: 'root',
		password: '0293248094',
		production: 'devtest',
		test: 'devtest',
	  pool: {
	    max: 5,
	    min: 0,
	    idle: 10000
	  }
	},
	rds: {
		reset: false,
		host: 'test.cktsz52qq75y.ap-southeast-1.rds.amazonaws.com',
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
	}
};