const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken')

const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');


const getUser = token => {
  try {

    if (token) {
      return jwt.verify(token, `${process.env.SECRET}`);
    }
    return null;

  } catch (err) {
    return null;
  }

}

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer(
	{ 	
		schema, 
		context: ({ req }) => {

		   const tokenWithBearer = req.headers.authorization || '';
		   const token = tokenWithBearer.split(' ')[1];
		   const profe = getUser(token);

		   return {
		     profe,
		   };

		},
	}
);

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Server is ready at ${url}`);
});