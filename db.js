/* global require exports */

const knex = require('knex')({
    client: 'pg',
    connection: {
	host: 'localhost',
	port: '5432',
	user: 'admin',
	database: 'myDb',
	charset: 'utf8'
    }
});

const bookshelf = require('bookshelf')(knex);

exports.bookshelf = bookshelf;
