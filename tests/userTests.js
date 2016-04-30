var expect = require('chai').expect;
var request = require('superagent');
var uuid = require('node-uuid');
var SERVER_ROOT = 'http://0.0.0.0:1337';

var email, password;

describe('Admin API Test', function() {
	
	it('test => "backendLogin"', function (done) {
		request
			.put(SERVER_ROOT+'/api/login/backend')
			.send({
				username: 'knocknock@knocknockapp.com',
				password: '12345678'
			})
			.end(function (err, res) {
				expect(res&&res.ok).to.be.ok;
				done(err);
			});
	});

	it('test => "createAdmin"', function (done) {
		email = uuid.v4()+'@test.com';
		password = '12345678';

		request
			.post(SERVER_ROOT+'/api/user/admin')
			.send({
				email: email,
				password: password
			})
			.end(function (err, res) {
				expect(res&&res.ok).to.be.ok;
				expect(res.body).to.have.property('email')
					.and.equal(email);
				expect(res.body).to.have.property('root');
				expect(res.body).to.have.property('createdAt');
				expect(res.body).to.have.property('updatedAt');
				expect(res.body).to.have.property('id');
				done(err);
			});
	})

	// it('test => "logIn"', function (done) {
	// 	request
	// 		.put(SERVER_ROOT+'/api/admin/login')
	// 		.send({
	// 			email: email,
	// 			password: password
	// 		})
	// 		.end(function (err, res) {
	// 			expect(res&&res.ok).to.be.ok;
	// 			done(err);
	// 		});
	// })
});