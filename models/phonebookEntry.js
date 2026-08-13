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
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    phone: {
        type: String,
        minLength: 9, // made it 9 to count for the '-'.
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d{5,}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    },
});

phonebookEntrySchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Entry', phonebookEntrySchema);