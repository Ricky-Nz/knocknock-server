// Import the required libraries
import express from 'express';
import graphqlHTTP from 'express-graphql';
import multer  from 'multer';
import { BackendSchema } from './schema';
import path from 'path';

const PORT = process.env.PORT||3000;
const storage = multer({ dest: 'uploads/' })

express()
	.use((req, res, next) => {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	})
	.options('/graphql', (req, res) => res.json(true))
	.use('/graphql', storage.single('file'))
  .use('/graphql', graphqlHTTP(req => ({
  	schema: BackendSchema,
  	pretty: true,
  	graphiql: true,
  	rootValue: { request: req }
  })))
  .use(express.static(path.join(__dirname, 'backendpublic')))
  .listen(PORT, () => console.log(`GraphQL server running on http://localhost:${PORT}`));
