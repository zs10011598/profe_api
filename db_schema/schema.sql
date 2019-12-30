CREATE TABLE profe(
					id serial, 
					nombre varchar(100),
					apellido_paterno varchar(100),
					apellido_materno varchar(100),
					email varchar(100),
					password varchar(100)
				  );

CREATE INDEX idx_profe_email ON profe(email);