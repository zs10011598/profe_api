CREATE TABLE profe(
					id serial PRIMARY KEY, 
					nombre varchar(100),
					apellido_paterno varchar(100),
					apellido_materno varchar(100),
					email varchar(100),
					password varchar(100)
				  );

CREATE INDEX idx_profe_email ON profe(email);

ALTER TABLE profe ADD COLUMN verificado bool DEFAULT false;

CREATE TABLE login(
					id serial PRIMARY KEY, 
					id_profe integer REFERENCES profe(id),
					dia timestamp default now()
				);

CREATE INDEX idx_login_id_profe ON login(id_profe);

CREATE TABLE estado(
					id serial PRIMARY KEY,
					nombre varchar(150)
					);

CREATE INDEX idx_estado_id ON estado(id);

CREATE TABLE municipio(
					id serial PRIMARY KEY,
					nombre varchar(150),
					id_estado integer 
					);

CREATE INDEX idx_municpio_id ON municipio(id);
CREATE INDEX idx_municpio_id_estado ON municipio(id_estado);

CREATE TABLE localidad(
					id serial PRIMARY KEY,
					nombre varchar(150),
					cp varchar(10),
					id_municipio integer 
						);

CREATE INDEX idx_localidad_id ON localidad(id);
CREATE INDEX idx_localidad_id_municipio ON localidad(id_municipio);

CREATE TABLE escuela(
					id serial PRIMARY KEY,
					nombre varchar(300),
					servicios_regionales varchar(200),
					clave varchar(100),
					zona varchar(50),
					sector varchar(50),
					organismo_publico varchar(200),
					calle_y_numero varchar(300),
					colonia varchar(200),
					cp varchar(50),
					id_estado integer REFERENCES estado(id),
					id_municipio integer REFERENCES municipio(id),
					id_localidad integer REFERENCES localidad(id),
					fecha_registro timestamp DEFAULT CURRENT_TIMESTAMP,
					fecha_actualizacion timestamp
					);

CREATE INDEX idx_escuela_id ON escuela(id);
CREATE INDEX idx_escuela_nombre ON escuela(nombre);
CREATE INDEX idx_escuela_id_estado ON escuela(id_estado);
CREATE INDEX idx_escuela_id_municipio ON escuela(id_municipio);
CREATE INDEX idx_escuela_id_localidad ON escuela(id_localidad);

CREATE TABLE rel_profe_escuela(
								id serial,
								id_profe integer REFERENCES profe(id),
								id_escuela integer REFERENCES escuela(id),
								fecha_registro timestamp DEFAULT CURRENT_TIMESTAMP
							);

CREATE INDEX idx_rel_profe_escuela_id_profe ON rel_profe_escuela(id_profe);
CREATE INDEX idx_rel_profe_escuela_id_escuela ON rel_profe_escuela(id_escuela);

CREATE TYPE sexo AS ENUM ('M', 'F');

ALTER TABLE profe ADD COLUMN fecha_nacimiento timestamp;
ALTER TABLE profe ADD COLUMN telefono varchar(50);
ALTER TABLE profe ADD COLUMN sexo sexo;
ALTER TABLE profe ADD COLUMN calle_y_numero varchar(300);
ALTER TABLE profe ADD COLUMN colonia varchar(200);
ALTER TABLE profe ADD COLUMN cp varchar(50);
ALTER TABLE profe ADD COLUMN id_estado integer REFERENCES estado(id) DEFAULT null;
ALTER TABLE profe ADD COLUMN id_municipio integer REFERENCES municipio(id) DEFAULT null;
ALTER TABLE profe ADD COLUMN id_localidad integer REFERENCES localidad(id) DEFAULT null;
ALTER TABLE profe ADD COLUMN fecha_registro timestamp DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE profe ADD COLUMN fecha_actualizacion timestamp;

CREATE INDEX idx_profe_fecha_nacimiento ON profe(fecha_nacimiento);
CREATE INDEX idx_profe_fecha_sexo ON profe(fecha_sexo);
CREATE INDEX idx_profe_fecha_cp ON profe(cp);
CREATE INDEX idx_profe_id_estado ON profe(id_estado);
CREATE INDEX idx_profe_id_municipio ON profe(id_municipio);
CREATE INDEX idx_profe_id_localidad ON profe(id_localidad);

CREATE TYPE grado AS ENUM ('1o', '2o', '3er', '4o', '5o', '6o');

CREATE TABLE nivel(
					id serial,
					id_profe integer REFERENCES profe(id),
					id_escuela integer REFERENCES escuela(id),
					nivel grado,
					fecha_registro timestamp DEFAULT CURRENT_TIMESTAMP,
					fecha_actualizacion timestamp
					);

CREATE INDEX idx_nivel_id_profe ON nivel(id_profe);
CREATE INDEX idx_nivel_id_escuela ON nivel(id_escuela);
CREATE INDEX idx_nivel_nivel ON nivel(nivel);

ALTER TABLE escuela RENAME COLUMN colonia TO numero_interior;
ALTER TABLE escuela ADD COLUMN turno integer DEFAULT 0;