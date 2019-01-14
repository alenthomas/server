/* global require exports */
const {
    getUsers,
    getUser,
    getUserDetails,
    getUserDetail
} = require('./queries.js');

const initUsers = async () => {
    try {
	let users = await getUsers();
	return users.toJSON();
    } catch(err) {
	console.error('Error initializing users: ', err);
	return [];
    }
};

const initUserDetails = async () => {
    try {
	let user_details = await getUserDetails();
	return user_details.toJSON();
    } catch(err) {
	console.error('Error initializing user_details: ', err);
	return [];
    }
};


exports.initUsers = initUsers;
exports.initUserDetails = initUserDetails;
