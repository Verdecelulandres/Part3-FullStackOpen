const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connecting to MongoDB at: ', url);

mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('Connection succesful.');
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message);
    });

const phonebookEntrySchema = new mongoose.Schema({
    name: String,
    phone: String,
});

phonebookEntrySchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Entry', phonebookEntrySchema);