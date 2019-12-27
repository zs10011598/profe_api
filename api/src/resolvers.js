const Sequelize = require('sequelize');
const { Profe } = require('./datasources/index.js');

const resolvers = {
  
  Query: {
    
    profeById: async (parent, { id }, context) => {

    	return Profe.find({
    					where: {id: id}, 
    					attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'email', 'password']
    				});

    },
  
  },

};

module.exports = resolvers;