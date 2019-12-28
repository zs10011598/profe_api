const { gql } = require('apollo-server');

const typeDefs = gql`

  interface Node {
    id: ID!
  }
  
  type Profe {
	  id: ID!
	  nombre: String!
	  apellidoPaterno: String!
	  apellidoMaterno: String
	  email: String!
	  password: String!
  }
  
  type GeneralResponse {
  	
  	profe: Profe
  	message: String!
  	error: Boolean!

  }

  type Query {

	  profeById(id: Int!): Profe
  
  }

  type Mutation {

	registerProfe(nombre: String!, apellidoPaterno: String!, apellidoMaterno: String, email: String!, password: String!): GeneralResponse!

  }

`;

module.exports = typeDefs;