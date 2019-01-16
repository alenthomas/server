/* global require exports */
const { Users, UserDetails } = require('./models.js');
const { getDoc } = require('./mongo.js');

const USER_DETAIL_READ_ERROR = 'User details read unsuccessful';
const DOC_GET_ERROR = 'Document fetch unsuccessful';

const USER_DETAIL_READ_SUCCESS = 'User details fetched successfully';
const DOC_GET_SUCCESS = 'Document fetched successfully';

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


const getDocument = (username) => {
    return getDoc(username)
	.then(docJson => ({
	    success: true,
	    info: DOC_GET_SUCCESS,
	    doc_details: docJson
	})
	     )
	.catch(err => {
	    console.error('Error getting doc: ', err);
	    return ({
		success: false,
		info: DOC_GET_ERROR,
		doc_details: {}
	    });
	});
};


exports.getUsers = getUsers;
exports.getUser = getUser;
exports.getUserDetails = getUserDetails;
exports.getUserDetail = getUserDetail;
exports.readUserDetails = readUserDetails;
exports.getDocument = getDocument;
