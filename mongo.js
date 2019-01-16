/* global require exports */
const dbUrl = 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb';
const dbName = 'docDb';

const mongoose = require('mongoose');

mongoose.connect(dbUrl);

const  db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () { console.log('connection successful'); });

db.useDb(dbName);

const Schema = mongoose.Schema;
const Document = new Schema({
    username: String,
    type: String,
    file: String
});

const Doc = mongoose.model('Doc', Document);

const createInitialDoc = (username) => {
    return new Doc({username}).save().then(doc => doc);
};

const updateDoc = (username, type, file) => {
    return Doc.findOneAndUpdate({username}, {type, file});
};

const getDoc = (username) => {
    return Doc.findOne({username})
	.then(doc => doc);
};

const delDoc = (username) => {
    return Doc.updateOne({username}, {type: '', file: ''});
};

exports.createInitialDoc = createInitialDoc;
exports.updateDoc = updateDoc;
exports.getDoc = getDoc;
exports.delDoc = delDoc;
