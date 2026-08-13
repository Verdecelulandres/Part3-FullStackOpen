require('dotenv').config();
const express = require('express');
const Entry = require('./models/phonebookEntry');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.static('dist'));
morgan.token('logData', (req, res) => JSON.stringify(res.logData));
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.logData(req, res)
    ].join(' ')
}));

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    Entry.find({}).then(result => {
        response.json(result);
    });
});

app.get('/info', (request, response) => {
    const receivedAt = new Date();
    Entry.find({}).then(result => {
        const content = `
            <h3>Phonebook has info for ${result.length} people</h3>
            <p>${receivedAt}</p>
        `;
        response.send(content);
    });
});
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Entry.findById(id)
        .then(result => {
            response.logData = result;
            response.json(result);
        })
        .catch(error => {
            response.sendStatus(404).end();
        });
});
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Entry.findByIdAndDelete(id)
        .then(result => {
            response.sendStatus(204).end();
        })
        .catch(error => {
            console.log(error.message);
            response.sendStatus(500).end();
        });
});

const generateId = () => {
    let newId = null;
    do {
        newId = Math.random() * 10000;
    } while (persons.some(p => p.id === newId));
    return String(Math.floor(newId));
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    console.log(body);

    if (body.name && body.phone) {
        // const personExists = persons.some(p => p.name === body.name);
        // if (personExists) {
        //     return response.status(400).json({
        //         error: 'person already exists'
        //     });
        // }
        const newEntry = new Entry({
            name: body.name,
            phone: body.phone
        });
        newEntry.save()
            .then(result => {
                response.logData = newEntry;
                response.json(newEntry);
            });

    } else {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})