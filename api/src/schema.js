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

  type School {

    id: ID!
    nombre: String!
    serviciosRegionales: String
    clave: String!
    zona: String!
    sector: String!
    organismoPublico: String
    calleYNumero: String
    numeroInterior: String
    colonia: String
    cp: String
    turno: Int!
    idEstado: Int!
    idMunicipio: Int!
    idLocalidad: Int!
    fechaActualizacion: String!

  }

  type Place {

    id: ID!
    nombre: String!
      
  }
  
  type GeneralResponse {
  	
  	profe: Profe
  	message: String!
  	error: Boolean!

  }

  type Response {
    
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
    getStates: [Place!]
    getMunicipalities(idEstado: Int!): [Place!]
    getZipCodes(idMunicipio: Int!): [Place!]
    getHoods(zipCode: Int!): [Place!]
    getAssociatedEscuelas: [School!]
    prueba: String!
  
  }

  type Mutation {

  	registerProfe(nombre: String!, apellidoPaterno: String!, apellidoMaterno: String, email: String!, password: String!): GeneralResponse!
    verifyProfe(email: String!): GeneralResponse!
  	login(email: String!, password: String!): LoginResponse!
    registerEscuela(nombre: String!, serviciosRegionales: String, clave: String!, zona: String!, sector: String!, turno: Int!, organismoPublico: String, calleYNumero: String, numeroInterior: String, cp: String, idEstado: Int!, idMunicipio: Int!, idLocalidad: Int!, fechaActualizacion: String!, email: String!): Response!

  }

`;

module.exports = typeDefs;