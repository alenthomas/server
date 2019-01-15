/* global require exports */

const { Users, UserDetails } = require('./models.js');
const { getUser } = require('./queries.js');

const createUser = (username, password) => {
    return new Users({username, password})
	.save()
	.then(user => {
	    // create an entry in userDetails
	    createUserDetail(user.id);
	    return user.toJSON();
	})
	.catch(err => console.error('Error creating User: ', err));
};

const updateUser = (username, password) => {
    return Users.where({username})
	.save({password}, {method: 'update', patch: true})
	.then(user => user.refresh())
	.then(user => user.toJSON())
	.catch(err => console.error('Error updating User: ', err));
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

exports.createUser = createUser;
exports.updateUser = updateUser;
exports.updateUserDetail = updateUserDetail;
exports.deleteUserDetail = deleteUserDetail;
