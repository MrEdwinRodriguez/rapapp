CREATE DATABASE rapapp_db;
USE rapapp_db;

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	uid char(64) NOT NULL,
	firstname varchar(50) NOT NULL,
	lastname varchar (50) NOT NULL,
	email varchar (50) NOT NULL,
	month varchar (50) NOT NULL,
	day INT (2) NOT NULL,
	year INT (4) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE recordings
(
	id int NOT NULL AUTO_INCREMENT,
	uid INT NOT NULL,
	recordings BLOB NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE comments
(
	id int NOT NULL AUTO_INCREMENT,
	submission_id INT  NOT NULL,
	comments varchar (10000)
	PRIMARY KEY (id)
);
