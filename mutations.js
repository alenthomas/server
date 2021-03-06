/* global require exports */

const { Users, UserDetails } = require('./models.js');
const { getUser, getUserDetail } = require('./queries.js');
const {
    createInitialDoc,
    updateDoc,
    delDoc
} = require('./mongo.js');

const USER_LOGIN_ERROR = 'Username or password invalid';
const USER_REGISTER_ERROR = 'Username not available';
const USER_EDIT_ERROR = 'User edit unsuccessful';
const USER_DETAIL_EDIT_ERROR = 'User detials edit unsuccessful';
const USER_DETAIL_REMOVE_ERROR = 'User details delete unsuccessful';
const DOC_UPLOAD_ERROR = 'Upload docs unsuccessful';
const DOC_DELETE_ERROR = 'Delete docs unsuccessful';

const USER_LOGIN_SUCCESS = 'User logined successfully';
const USER_REGISTER_SUCCESS = 'User created successfully';
const USER_EDIT_SUCCESS = 'User updated successfully';
const USER_DETAIL_EDIT_SUCCESS = 'User details updated successfully';
const USER_DETAIL_REMOVE_SUCCESS = 'User details deleted successfully';
const DOC_UPLOAD_SUCCESS = 'Uploaded  docs successfully';
const DOC_DELETE_SUCCESS = 'Deleted docs successfully';

const createUser = (username, password) => {
    return new Users({username, password})
	.save()
	.then(user => {
	    createUserDetail(user.id);
	    createInitialDoc(username);
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
	});
};

const deleteUserDetail = (username) => {
    return getUser(username)
	.then(user => user.id)
	.then(user_id => {
	    return UserDetails.where({user_id})
		.save({place: null, doc_id: null}, {method: 'update', patch: true})
		.then(user_details => user_details.refresh())
		.then(user_details => user_details.toJSON());
	});
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

const editUserDetails = (username, place, doc_id) => {
    return updateUserDetail(username, place, doc_id)
	.then(userDetailJson => ({
		success: true,
		info: USER_DETAIL_EDIT_SUCCESS,
		user_details: userDetailJson
	})
	     )
	.catch(err => {
	    console.error('Error updating user detail: ', err);
	    return ({
		success: false,
		info: USER_DETAIL_EDIT_ERROR,
		user_details: {}
	    });
	});
};

const removeUserDetails = (username) => {

    delDoc(username)
	.then(e => e)
	.catch(err =>
	       console.error('Error deleting doc: ', err)
	      );
    
    return deleteUserDetail(username)
	.then(userDetailJson => ({
	    success: true,
	    info: USER_DETAIL_REMOVE_SUCCESS,
	    user_details: userDetailJson
	})
	     )
	.catch(err => {
	    console.error('Error deleting user detail: ', err);
	    return ({
		success: false,
		info: USER_DETAIL_REMOVE_ERROR,
		user_details: {}
	    });
	});
};

const uploadDoc = (username, type, file) => {
    return updateDoc(username, type, file)
	.then(docJson => ({
	    success: true,
	    info: DOC_UPLOAD_SUCCESS,
	    doc_details: docJson
	})
	     )
	.catch(err => {
	    console.error('Error uploading doc: ', err);
	    return ({
		success: false,
		info: DOC_UPLOAD_ERROR,
		doc_details: {}
	    });
	});
};

const removeDoc = (username) => {
    return delDoc(username)
	.then(docJson => ({
	    success: true,
	    info: DOC_DELETE_SUCCESS
	})
	     )
	.catch(err => {
	    console.error('Error deleting doc: ', err);
	    return ({
		success: false,
		info: DOC_DELETE_ERROR
	    });
	});
};



exports.deleteUserDetail = deleteUserDetail;
exports.login = login;
exports.register = register;
exports.editUser = editUser;
exports.editUserDetails = editUserDetails;
exports.removeUserDetails = removeUserDetails;
exports.uploadDoc = uploadDoc;
exports.removeDoc = removeDoc;
