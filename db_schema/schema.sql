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
CREATE INDEX idx_localidad_id_municipio ON localidad(id_municpio);