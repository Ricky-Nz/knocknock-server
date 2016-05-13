var assert = require('chai').assert;
var request = require('superagent');
var uuid = require('node-uuid');
var SERVER_ROOT = 'http://0.0.0.0:1337';

describe('Admin API Test', function() {
	var token = null;
	var email, password;

	function login (terminal, done) {
		request
			.put(SERVER_ROOT+'/api/login/'+terminal)
			.send({
				username: 'knocknock@knocknockapp.com',
				password: '12345678'
			})
			.end(function (err, res) {
				assert.isOk(res.ok, JSON.stringify(res.body));
				assert.property(res.body, 'token', 'token not found');
				token = res.body.token;
				done();
			});
	}

	function crateUser (role, done) {
		var random = uuid.v4();
		email = random+'@test.com';
		password = '12345678';

		request
			.post(SERVER_ROOT+'/api/user/'+role)
			.set({
				'x-access-token': token
			})
			.send({
				email: email,
				password: password,
				name: random,
				contact: '99990000'
			})
			.end(function (err, res) {
				assert.isOk(res.ok, JSON.stringify(res.body));
				assert.property(res.body, 'email', 'email not found');
				done();
			});
	}

	it('backendLogin', function (done) {
		login('backend', done);
	});

	it('webLogin', function (done) {
		login('web', done);
	});

	it('appLogin', function (done) {
		login('app', done);
	});

	it('createClient', function (done) {
		crateUser('client', done);
	});

	it('createWorker', function (done) {
		crateUser('worker', done);
	});

	it('createAdmin', function (done) {
		crateUser('admin', done);
	});

	var createdOrder;

	it('create order', function (done) {
		request
			.post(SERVER_ROOT+'/api/laundryorder')
			.set({
				'x-access-token': token
			})
			.send({
				pickupDate: new Date()
			})
			.end(function (err, res) {
				assert.isOk(res.ok, JSON.stringify(res.body));
				assert.property(res.body, 'id', 'order id not found');
				createdOrder = res.body;
				done();
			});
	});

	it('update order', function (done) {
		request
			.put(SERVER_ROOT+'/api/laundryorder/'+createdOrder.id)
			.set({
				'x-access-token': token
			})
			.send({
				pickupDate: new Date()
			})
			.end(function (err, res) {
				assert.isOk(res.ok, JSON.stringify(res.body));
				assert.property(res.body, 'id', 'order id not found');
				done();
			});
	});
});

