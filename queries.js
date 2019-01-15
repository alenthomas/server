/* global require exports */
const { Users, UserDetails } = require('./models.js');

const USER_DETAIL_READ_ERROR = 'User details read unsuccessful';
const USER_DETAIL_READ_SUCCESS = 'User details fetched successfully';

const getUsers = () => {
    return Users.fetchAll()
	.then(users => users)
	.catch(err => console.error('Error fetching users[]: ', err));
};
    
const getUser = (username) => {
    return Users.query({where: {username}})
	.fetch()
	.then(user => user);
};

const getUserDetails = () => {
    return UserDetails.fetchAll()
	.then(user_details => user_details)
	.catch(err => console.error('Error fetching user details[]: ', err));
};


const getUserDetail = (username) => {
    return getUser(username)
	.then(user => user.id)
	.then(user_id => {
	    return UserDetails.query({where: {user_id}})
		.fetch()
		.then(user_detail => user_detail.toJSON());
	});
};

const readUserDetails = (username) => {
    return getUserDetail(username)
	.then(userDetailJson => ({
	    success: true,
	    info: USER_DETAIL_READ_SUCCESS,
	    user_details: userDetailJson
	})
	     )
	.catch(err => {
	    console.error('Error getting user detail: ', err);
	    return ({
		success: false,
		info: USER_DETAIL_READ_ERROR,
		user_details: {}
	    });
	});
};


const getDocument = (doc_id) => {
    // todo
};


exports.getUsers = getUsers;
exports.getUser = getUser;
exports.getUserDetails = getUserDetails;
exports.getUserDetail = getUserDetail;
exports.readUserDetails = readUserDetails;
