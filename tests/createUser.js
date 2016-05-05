var expect = require('chai').expect;
var request = require('superagent');
var uuid = require('node-uuid');
var SERVER_ROOT = 'http://0.0.0.0:1337';

var email, password;

describe('Admin API Test', function() {
	var token = null;
	
	it('test => "backendLogin"', function (done) {
		request
			.put(SERVER_ROOT+'/api/login/backend')
			.send({
				username: 'knocknock@knocknockapp.com',
				password: '12345678'
			})
			.end(function (err, res) {
				expect(res&&res.ok).to.be.ok;
				expect(res.body).to.have.property('token');
				token = res.body.token;
				done(err);
			});
	});

	it('test => "createWorker"', function (done) {
		var random = uuid.v4();
		email = random+'@test.com';
		password = '12345678';

		request
			.post(SERVER_ROOT+'/api/user/worker')
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
				expect(res&&res.ok).to.be.ok;
				expect(res.body).to.have.property('email')
					.and.equal(email);
				done(err);
			});
	})
});