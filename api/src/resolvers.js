const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Profe, Login, Estado, Municipio } = require('./datasources/index.js');


const resolvers = {
  
  Query: {
    
    profeById: async (parent, { id }, context) => {

      return Profe.findOne({
              where: {id: id}, 
              attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'email', 'password']
            });

    },

    currentProfe: (parent, args, { profe }, context) => {
      
      if (!profe) {
        console.log('Not Authenticated');
        throw new Error('Not Authenticated');
      }
      return Profe.findOne({ where: { id: profe.id }});

    },

    getStates: (parent, args, { profe }, context) => {

      if (!profe) {                             // En esta linea se verifica el token
        throw new Error('Not Authenticated');
      }
      return Estado.findAll();

    },

    getMunicipalities: (parent, args, { profe }, context) => {

      if (!profe) {                             // En esta linea se verifica el token
        throw new Error('Not Authenticated');
      }
      return Municipio.findAll({
        where: {id_estado: args['idEstado']},
        attributes: ['id', 'nombre']
      });

    },

    prueba: (parent, args, { profe }, context) => {

      if (!profe) {                             // En esta linea se verifica el token
        throw new Error('Not Authenticated');
      }
      return 'Hola';
    }
  
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
        
        console.log(message);

        resgister_profe_response['profe'] = null;
        resgister_profe_response['error'] = true;
        resgister_profe_response['message'] = message;
        return resgister_profe_response;

      } else {
        

        const hashed_password = await bcrypt.hash(password, 10);

        const new_profe = Profe.build({nombre: nombre, 
                                       apellidoPaterno: apellidoPaterno,
                                       apellidoMaterno: apellidoMaterno,
                                       email: email,
                                       password: hashed_password,
                                       verificado: false
                                     });

        return new_profe.save().then(profe => {
          
          message = 'Usuario registrado correctamente!';
          resgister_profe_response['profe'] = profe;
          resgister_profe_response['error'] = false;
          resgister_profe_response['message'] = message;
          return resgister_profe_response;
        
        }).catch(error => {
          
          message = 'Ocurrio un error al insertar el usuario! ' + error;

          console.log(error);

          resgister_profe_response['profe'] = null;
          resgister_profe_response['error'] = true;
          resgister_profe_response['message'] = message;

          return resgister_profe_response;

        });

      }

 

    },

    verifyProfe: async (parent, { email }, context, info) => {

      const profe = await Profe.findOne({
        where: { email: email }
      });      

      verify_profe_response = {};

      if (!profe) {
        
        message = 'No existe profe con ID ' + email;
        console.log(message);
        
        verify_profe_response['profe'] = null;
        verify_profe_response['error'] = true;
        verify_profe_response['message'] = message;

        return verify_profe_response;

      }      

      profe.update({
        verificado: true
      });

      verify_profe_response['profe'] = profe;
      verify_profe_response['error'] = false;
      verify_profe_response['message'] = '';

      return verify_profe_response;

    },

    login: async (parent, { email, password }, context, info) => {
      
      const profe = await Profe.findOne({
        where: { email: email }
      });

      var password_match = false;
      var logged_in = false;
      var token = '';

      if (!profe) {
        
        console.log('Login invalido!');
      
      } else {

        password_match = await bcrypt.compare(password, profe.password);
        logged_in = true;
        token = jwt.sign(
          {
            id: profe.id,
            username: profe.email,
          },
          `${process.env.SECRET}`,
          {
            expiresIn: '1d',
          },
        );

        const login = Login.build({
          id_profe: profe.id,
        });
        
        login.save();
      }

      if (!password_match) {
        
        console.log('Login invalido!');
        logged_in = false;
        token = '';

      }

      return {
        
        profe: profe,
        token: token,
        loggedIn: logged_in,
      
      };

    },

  }

};

module.exports = resolvers;