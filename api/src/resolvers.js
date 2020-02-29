const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { QueryTypes } = require('sequelize');
const { Profe, Login, Estado, Municipio, Localidad, Escuela, ProfeDB } = require('./datasources/index.js');


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

    getMunicipalities: async (parent, args, { profe }, context) => {

      if (!profe) {                             // En esta linea se verifica el token
        throw new Error('Not Authenticated');
      }
      return Municipio.findAll({
        where: {id_estado: args['idEstado']},
        attributes: ['id', 'nombre']
      });

    },

    getZipCodes: async (parent, args, { profe }, context) => {

      if (!profe) {                             // En esta linea se verifica el token
        throw new Error('Not Authenticated');
      }
      var aux = await Localidad.findAll({
        where: {id_municipio: args['idMunicipio']},
        attributes: ['cp']
      });

      var cp = []
      var zc = []

      aux.forEach(item  => {

        cp.push(item.dataValues['cp'])

      })

      cp = Array.from(new Set(cp)) 
      
      cp.forEach(item => {

        zc.push({id: item, nombre: item})

      })



      return zc

    },

    getHoods: async (parent, args, { profe }, context) => {

      if (!profe) {                             // En esta linea se verifica el token
        throw new Error('Not Authenticated');
      }
      return Localidad.findAll({
        where: {cp: '' + args['zipCode']},
        attributes: ['id', 'nombre']
      });

    },

    getAssociatedEscuelas: async (parent, args, { profe }, context) => {

      if (!profe) {                             // En esta linea se verifica el token
        throw new Error('Not Authenticated');
      }

      var escuelas = []

     
      const id_profe = profe.id

      const relations = await ProfeDB.query(`SELECT id_escuela FROM rel_profe_escuela WHERE id_profe=${id_profe}`, { type: QueryTypes.SELECT });

      relations.forEach(item => {

        escuelas.push(item['id_escuela'])

      })

      return Escuela.findAll({where: {id: escuelas}})

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


    registerEscuela: async (parent, args, { profe }, context) => {

      if (!profe) {                             // En esta linea se verifica el token
        throw new Error('Not Authenticated');
      }

      var email = args['email']
      var profe = await Profe.findOne({ where: { email: email }})
      const id_profe = profe.id
      
      var resgister_response = {};
      
      const new_escuela = Escuela.build({

        nombre: args['nombre'],
        serviciosRegionales: args['serviciosRegionales'],
        clave: args['clave'],
        zona: args['zona'],
        sector: args['sector'],
        organismoPublico: args['organismoPublico'],
        calleYNumero: args['calleYNumero'],
        numeroInterior: args['numeroInterior'],
        cp: args['cp'],
        turno: args['turno'],
        idEstado: args['idEstado'],
        idMunicipio: args['idMunicipio'],
        idLocalidad: args['idLocalidad'],
        fechaActualizacion: args['fechaActualizacion']

      })

      return new_escuela.save().then(escuela => {
          
          message = 'Escuela registrada correctamente!'
          resgister_response['error'] = false;
          resgister_response['message'] = message;

          const id_escuela = escuela.id


          ProfeDB.query(`INSERT INTO rel_profe_escuela(id_profe, id_escuela) values(${id_profe}, ${id_escuela})`, { type: QueryTypes.SELECT });

          return resgister_response;
        
        }).catch(error => {
          
          message = 'Ocurrio un error al insertar la escuela! ' + error

          console.log(error);
          resgister_response['error'] = true;
          resgister_response['message'] = message;

          return resgister_response;

        });

    }

  }

};

module.exports = resolvers;