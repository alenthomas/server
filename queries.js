/* global require exports */
const { Users, UserDetails } = require('./models.js');

const getUsers = () => {
    return Users.fetchAll()
	.then(users => users)
	.catch(err => console.error('Error fetching users[]: ', err));
};
    
const getUser = (username) => {
    return Users.fetch({username})
	.then(user => user)
	.catch(err => console.error('Error fetching user: ', err));
};

const getUserDetails = () => {
    return UserDetails.fetchAll()
	.then(user_details => user_details)
	.catch(err => console.error('Error fetching user details[]: ', err));
};


const getUserDetail = (user_id) => {
    return UserDetails.fetch({user_id})
	.then(user_detail => user_detail)
	.catch(err => console.error('Error fetching user detail: ', err));
};

const getUserFromDetail = (id) => {
    return UserDetails.fetch({id})
	.then(user_detail => user_detail.user())
	.then(user => user)
	.catch(err => console.error('Error fetching user from detail: ', err));
};

const getDocument = (doc_id) => {
    // todo
};


exports.getUsers = getUsers;
exports.getUser = getUser;
exports.getUserDetails = getUserDetails;
exports.getUserDetail = getUserDetail;
exports.getUserFromDetail = getUserFromDetail;
