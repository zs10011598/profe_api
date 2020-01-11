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