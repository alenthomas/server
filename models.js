/* global require exports */

const { bookshelf } = require('./db.js');

const Users = bookshelf.Model.extend({
    tableName: 'users',
    user_details: function () {
	return this.hasOne(UserDetails);
    }
});

const UserDetails = bookshelf.Model.extend({
    tableName: 'user_details',
    user: function () {
	return this.belongsTo(Users);
    }
});

exports.Users = Users;
exports.UserDetails = UserDetails;
