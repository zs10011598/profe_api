require('dotenv').config();
const Sequelize = require('sequelize');

DataTypes = Sequelize.DataTypes

const ProfeDB = new Sequelize(`${process.env.DBNAME}`, `${process.env.DBUSER}`, `${process.env.DBPASS}`, 
				{ dialect: 'postgres', host: `${process.env.DBHOST}`, port: `${process.env.DBPORT}`});

ProfeDB
	.authenticate()
	.then(() => {
		console.log('connected to profe DB');
	})
	.catch((err) => {
		console.error('unable to ceonnect to profe DB ', err);
	});

const Profe = ProfeDB.define('profe', 
	{
		id: {
			autoIncrement: true,
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		nombre: {
			allowNull: false,
			type: Sequelize.STRING	
		},
		apellidoPaterno: {
			field: 'apellido_paterno',
			allowNull: false,
			type: Sequelize.STRING	
		},
		apellidoMaterno: {
			field: 'apellido_materno',
			allowNull: true,
			type: Sequelize.STRING	
		},
		email: {
			allowNull: false,
			type: Sequelize.STRING	
		},
		password: {
			allowNull: false,
			type: Sequelize.STRING	
		},
		verificado: {
			allowNull: false,
			type: Sequelize.BOOLEAN	
		}	
	}, 
	{
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports.Profe = Profe;
