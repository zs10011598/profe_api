const { gql } = require('apollo-server');

const typeDefs = gql`

  interface Node {
    id: ID!
  }
  
  type Profe implements Node {
	  id: ID!
	  nombre: String!
	  apellidoPaterno: String!
	  apellidoMaterno: String
	  email: String!
	  password: String!
  }
  
  extend type Query {

	  profeById(id: Int!): Profe
  
  }

  type Mutation {

	registrarProfe(nombre: String!, apellidoPaterno: String!, apellidoMaterno: String, email: String!, password: String!): Profe!

  }

`;

module.exports = typeDefs;