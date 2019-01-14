/* global require exports */

const { Users, UserDetails } = require('./models.js');

const createUser = (username, password) => {
    return new Users({username, password})
	.save()
	.then(user => user.toJSON())
	.catch(err => console.error('Error creating User: ', err));
};

const updateUser = (user_id, {username, password}) => {
    return Users.forge({id: user_id, username, password})
	.save()
	.then(user => user.id)
	.catch(err => console.error('Error updating User: ', err));
};

const createUserDetail = (user_id, place, doc_id) => {
    return new UserDetails({user_id, place, doc_id})
	.save()
	.then(user_details => user_details.id)
	.catch(err => console.error('Error creating UserDetail: ', err));
};

const updateUserDetail = (user_id, {place, doc_id}) => {
    return UserDetails.forge({user_id, place, doc_id})
	.save()
	.then(user_details => user_details.id)
	.catch(err => console.error('Error updating UserDetail: ', err));
};

const deleteUserDetail = (user_id) => {
    return UserDetails({user_id})
	.destroy()
	.then(user_details => user_details.id)
	.catch(err => console.error('Error deleting UserDetail: ', err));
};

exports.createUser = createUser;
exports.updateUser = updateUser;
exports.createUserDetail = createUserDetail;
exports.updateUserDetail = updateUserDetail;
exports.deleteUserDetail = deleteUserDetail;
