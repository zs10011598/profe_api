const Sequelize = require('sequelize');
const { Profe } = require('./datasources/index.js');

const debug = require('debug');

const resolvers = {
  
  Query: {
    
    profeById: async (parent, { id }, context) => {

    	return Profe.find({
    					where: {id: id}, 
    					attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'email', 'password']
    				});

    },
  
  },

  Mutation: {

    registerProfe: async (parent, {nombre, apellidoPaterno, apellidoMaterno, email, password}, context) => {

      const total_profes = await Profe.find({
              where: {email: email}, 
              attributes: [[Sequelize.fn('count', Sequelize.col('id')), 'num_profes']]
            });

      resgister_profe_response = {};

      if(total_profes.dataValues.num_profes > 0){
        
        message = 'No se pudo insertar el usuario, el email ya existe!';
        
        debug(message);

        resgister_profe_response['profe'] = null;
        resgister_profe_response['error'] = true;
        resgister_profe_response['message'] = message;
        return resgister_profe_response;

      } else {
        
        const new_profe = Profe.build({nombre: nombre, 
                                       apellidoPaterno: apellidoPaterno,
                                       apellidoMaterno: apellidoMaterno,
                                       email: email,
                                       password: password});

        return new_profe.save().then(profe => {
          
          message = 'Usuario registrado correctamente!';
          resgister_profe_response['profe'] = profe;
          resgister_profe_response['error'] = false;
          resgister_profe_response['message'] = message;
          return resgister_profe_response;
        
        }).catch(error => {
          
          message = 'Ocurrio un error al insertar el usuario! ' + error;

          debug(error);

          resgister_profe_response['profe'] = null;
          resgister_profe_response['error'] = true;
          resgister_profe_response['message'] = message;

          return resgister_profe_response;

        });

      }

 

    }

  }

};

module.exports = resolvers;