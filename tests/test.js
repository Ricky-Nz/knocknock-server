var oauth2orize = require('oauth2orize');
var server = oauth2orize.createServer();

server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
  console.log(111);
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
  console.log(222);
}));

server.token(function (req, res, next) {
	console.log(req);
});