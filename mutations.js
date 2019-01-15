/* global require exports */

const { Users, UserDetails } = require('./models.js');
const { getUser } = require('./queries.js');

const USER_LOGIN_ERROR = 'Username or password invalid';
const USER_REGISTER_ERROR = 'Username not available';
const USER_EDIT_ERROR = 'User edit unsuccessful';

const USER_LOGIN_SUCCESS = 'User logined successfully';
const USER_REGISTER_SUCCESS = 'User created successfully';
const USER_EDIT_SUCCESS = 'User updated successfully';

const createUser = (username, password) => {
    return new Users({username, password})
	.save()
	.then(user => {
	    createUserDetail(user.id);
	    return user.toJSON();
	});
};

const updateUser = (username, password) => {
    return Users.where({username})
	.save({password}, {method: 'update', patch: true})
	.then(user => user.refresh())
	.then(user => user.toJSON());
};

const createUserDetail = (user_id) => {
    return new UserDetails({user_id, place: null, doc_id: null})
	.save()
	.then(user_details => user_details.id)
	.catch(err => console.error('Error creating UserDetail: ', err));
};

const updateUserDetail = (username, place=null, doc_id=null) => {
    let payload = {};
    if(!place) {
	payload = {doc_id};
    }
    if(!doc_id) {
	payload = {place};
    }
    if(place && doc_id) {
	payload = {place, doc_id};
    }
    return getUser(username)
	.then(user => user.id)
	.then(user_id => {
	    return UserDetails.where({user_id})
		.save(payload, {method: 'update', patch: true})
		.then(user_details => user_details.refresh())
		.then(user_details => user_details.toJSON());
	})
	.catch(err => console.error('Error updating UserDetail: ', err));
};

const deleteUserDetail = (username) => {
    return getUser(username)
	.then(user => user.id)
	.then(user_id => {
	    return UserDetails.where({user_id})
		.save({place: null, doc_id: null}, {method: 'update', patch: true})
		.then(user_details => user_details.refresh())
		.then(user_details => user_details.toJSON());
	})
	.catch(err => console.error('Error deleting UserDetail: ', err));
};

const login = (username, password) => {
    return Users.query({where: {username, password}})
	.fetch()
	.then(user => user.toJSON())
	.then(userJson => (
	    {success: true, info: USER_LOGIN_SUCCESS, user: userJson}
	))
	.catch(err => {
	    console.error('Error getting user: ', err);
	    return (
		{success: false, info: USER_LOGIN_ERROR, user: {}}
	    );
	});

};

const register = (username, password) => {
    return createUser(username, password)
	.then(userJson => (
	    {success: true, info: USER_REGISTER_SUCCESS, user: userJson}
	))
	.catch(err => {
	    console.error('Error creating User: ', err);
	    return (
		{success: false, info: USER_REGISTER_ERROR, user: {}}
	    );
	});
};

const editUser = (username, password) => {
    return updateUser(username, password)
	.then(userJson => (
	    {success: true, info: USER_EDIT_SUCCESS, user: userJson}
	))
	.catch(err => {
	    console.error('Error updating User: ', err);
	    return (
		{success: false, info: USER_EDIT_ERROR, user: {}}
	    );
	});
};


exports.updateUserDetail = updateUserDetail;
exports.deleteUserDetail = deleteUserDetail;
exports.login = login;
exports.register = register;
exports.editUser = editUser;
