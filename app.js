// Import the required libraries
import express from 'express';
import graphqlHTTP from 'express-graphql';
import multer  from 'multer';
import bodyParser from 'body-parser';
import { AppSchema } from './schema';
import path from 'path';
import jwt from 'jsonwebtoken';
import { Users } from './service/database';
import { verifyPassword } from './schema/utils';

const PORT = process.env.PORT||3000;
const storage = multer({ dest: 'uploads/' })

function generateToken(userId) {
  return jwt.sign({ id: userId }, 'knocknockserver-secret-token');
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'knocknockserver-secret-token', function(err, payload) {
      if (err) {
        reject('invalid token!');
      } else {
        resolve(payload.id);
      }
    });
  });
}

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//{expires: new Date(Date.now() + 900000)}

express()
  .post('/login', urlencodedParser, jsonParser, ({body}, res) => {
    Users.findOne({where:{contact_no:body.username}})
    .then(user => {
      if (!user) return res.json({error: 'username or password not corrrect1'});

      return verifyPassword(body.password, user.encrypted_password)
        .then(() => res.json({token: generateToken(user.id)}))
        .catch(() => res.json({error: 'username or password not corrrect2'}))
    })
    .catch((error) => res.json({error: error}))
  })
	.use('/graphql', storage.single('file'))
  .use('/graphql', (req, res, next) => {
    verifyToken(req.headers.authorization)
      .then(userId => {
        req.userId = userId;
        next();
      })
      .catch(err => res.sendStatus(403));
  }, graphqlHTTP(req => ({
  	schema: AppSchema,
  	pretty: true,
  	graphiql: true,
    context: {
      userId: req.userId
    },
  	rootValue: { request: req },
    formatError: error => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack
    })
  })))
  .use(express.static(path.join(__dirname, 'public')))
  .listen(PORT, () => console.log(`GraphQL server running on http://localhost:${PORT}`));
