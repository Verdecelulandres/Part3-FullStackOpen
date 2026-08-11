const mongoose = require('mongoose');

// Not enough arguments errors.
if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
} else if (process.argv.length === 4) {
    console.log('Please provide a name and phone number to be saved.');
    process.exit(1);
} else if (process.argv.length > 5) {
    console.log('Too many arguments');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://andreslaverde_db_user:${password}@cluster0.io7wr4m.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url, { family: 4 });

const phonebookEntrySchema = new mongoose.Schema({
    name: String,
    phone: String,
});

const Entry = mongoose.model('Entry', phonebookEntrySchema);

if (process.argv.length === 3) {

    Entry.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(entry => {
            console.log(entry.name, entry.phone);
        });
        mongoose.connection.close();
    });

} else if (process.argv.length === 5) {

    const entryName = process.argv[3];
    const entryPhone = process.argv[4];

    const entry = new Entry({
        name: entryName,
        phone: entryPhone,
    })

    entry.save().then(result => {
        console.log(`added ${entryName} number ${entryPhone} to phonebook`);
        mongoose.connection.close();
    });
}

