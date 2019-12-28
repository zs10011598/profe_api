const { gql } = require('apollo-server');

const typeDefs = gql`
  
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

  type LoginResponse {

  	profe: Profe
  	token: String
  	loggedIn: Boolean!

  }

  type Query {

	  profeById(id: Int!): Profe
	  currentProfe: Profe!
  
  }

  type Mutation {

	registerProfe(nombre: String!, apellidoPaterno: String!, apellidoMaterno: String, email: String!, password: String!): GeneralResponse!
	login(email: String!, password: String!): LoginResponse!

  }

`;

module.exports = typeDefs;