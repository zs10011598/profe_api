const debug = require('debug');
const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');


const log = debug('SEE-GAP:log');
const errLog = debug('SEE-GAP:error');

const context = {
	logger: {
		log,
		errLog,
	},
};

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({ schema, context });

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Server is ready at ${url}`);
});