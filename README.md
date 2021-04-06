# profe_api

## Description

This repository contains graphql api's profe plataform. It can be 
divided in two parts:

* First: folder `api` contains a GraphQL API (NodeJS).
* Second: folder `db_schema` contains db schema and jupyter notebooks 
(Python3) to fill some tables in the db.  


## Install dependencies

### API Dependencies

Enter to `./api/` and type `npm install`.

### DB Schema Dependencies

Enter to `./db_schema/` and type `pip3 install -r requirements.txt`


## Build Database

The database engine used is postgreSQL >= 12. After, we verify we have 
correct version of database engine we must load the dump 
`./db_schema/schema.sql` into a empty database, this step will create
the db schema. Finally, in order to fill some tables into the db, we 
must type `jupyter notebook` inside `./db_schema/` to run all cells in
the notebook called `./db_schema/estados_municipios_y_localidades.ipynb`


## Deploy

1. `npm`: Enter to `./api/` and type `npm start`
2. `docker-compose`: In the root directory type `docker-compose build` 
and then `docker-compose up`


## DB cconfiguration

Define the following environmental variables,  in order to configure the database:

* `DBHOST`
* `DBPORT`
* `DBNAME`
* `DBUSER`
* `DBPASS`

## Developer

-Pedro R [promerowork26@gmail.com]
