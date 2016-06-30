// Import the required libraries
import express from 'express';
import graphqlHTTP from 'express-graphql';
import multer  from 'multer';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import request from 'request';
import { AppSchema } from './schema';
import path from 'path';
import jwt from 'jsonwebtoken';
import { Users, UserCredits } from './service/database';
import { completePaypalExpressPayment } from './service/payment';
import { verifyPassword } from './schema/utils';
import { processOrderPayment } from './schema/paymentUtils';

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
  .use(cookieParser())
  .post('/api/fblogin', urlencodedParser, jsonParser, ({body}, res) => {
    request({
      uri: 'https://graph.facebook.com/me',
      qs: {
        fields: 'id,email,first_name,last_name,picture{url}',
        access_token: body.token
      },
      json: true
    }, (err, response, {id, email, first_name, last_name, picture}) => {
      if (err || !id) return res.status(400).send('login failed');

      Users.findOne({where:{email}})
        .then(user => {
          if (user) return user;

          return Users.create({
            email,
            first_name,
            last_name,
            profile_image_url_small: picture.data&&picture.data.url
          });
        })
        .then(user => {
          res.cookie('token', generateToken(user.id));
          res.json({
            bindContact: !user.is_verified,
            setupProfile: !user.first_name || !user.last_name
          });
        })
        .catch(err => res.status(400).send('login failed'));
    });
  })
  .post('/api/login', urlencodedParser, jsonParser, ({body}, res) => {
    if (!body.username || !body.password) {
      return res.status(400).send('username or password can not be empty');
    }

    const username = body.username.toLowerCase();
    const password = body.password.toLowerCase();

    Users.findOne({where:{$or: [
      {contact_no: username},
      {email: username}
    ]}})
    .then(user => {
      if (!user) return res.status(400).send('username or password not correct');

      return verifyPassword(password, user.encrypted_password)
        .then(() => {
          res.cookie('token', generateToken(user.id));
          res.json({
            bindContact: !user.is_verified,
            setupProfile: !user.first_name || !user.last_name
          });
        })
        .catch(error => res.status(400).send(error))
    })
    .catch(error => res.status(400).send(error))
  })
  .get('/api/check', urlencodedParser, ({query}, res) => {
    if (!query.email) return res.status(400).send('check email can not be empty');

    const email = query.email.toLowerCase();

    Users.findOne({where:{email}})
      .then(user => {
        if (user) return res.status(400).send('email already taken');

        res.sendStatus(200);
      })
      .catch(error => res.status(400).send(error))
  })
  .post('/api/register', urlencodedParser, jsonParser, ({body}, res) => {
    if (!body.username || !body.password) {
      return res.status(400).send('username or password can not be empty');
    }

    const email = body.username.toLowerCase();
    const password = body.password.toLowerCase();

    Users.findOne({where:{email}})
      .then(user => {
        if (user) return res.status(400).send('email already taken');

        return Users.create({
            email,
            encrypted_password: password
          }).then(user => {
            res.cookie('token', generateToken(user.id));
            res.sendStatus(200);
          });
      })
      .catch(error => res.status(400).send(error))
  })
  .use('/payment/success', function (req, res, next) {
    completePaypalExpressPayment({token: req.query.token, PayerID: req.query.PayerID})
      .then(({token, amount, currency, refNo}) => {
        if (req.query.orderId) {
          const {userId, orderId, voucherId, promoCodeId} = req.query;
          return processOrderPayment({userId, orderId, voucherId, promoCodeId}, ({localOrderId, toPayPrice}) => {
              return new Promise((resolve) => resolve({
                  success: true,
                  paymentMode: 'paypal',
                  paymentRefToken: refNo
                }));
            });
        } else {
          return UserCredits.findOne({where:{paypal_ref_no: token}})
            .then(credits =>
              credits.update({
                paypal_ref_no: refNo,
                status: 1,
                approved_on: new Date(),
                approved_by: 'paypal'
              })
              .then(() => Users.findById(credits.user_id))
              .then(user => user.increment({credit: parseFloat(amount)}))
              .catch(error => next(error))
            )
            .catch(error => next(error))
        }
      })
      .then(() => next())
      .catch(error => next(error));
  }, express.static(path.join(__dirname, 'apppublic', 'success.html')))
  .use('/payment/failure', function (req, res) {
    next();
  }, express.static(path.join(__dirname, 'apppublic', 'failure.html')))
	.use('/graphql', storage.single('file'))
  .use('/graphql', (req, res, next) => {
    verifyToken(req.cookies.token)
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
  .use(express.static(path.join(__dirname, 'apppublic')))
  .listen(PORT, () => console.log(`GraphQL server running on http://localhost:${PORT}`));
