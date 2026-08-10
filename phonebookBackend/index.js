const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('combined'));

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
const PORT = 3001;

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const receivedAt = new Date();
    const content = `
    <h3>Phonebook has info for ${persons.length} people</h3>
    <p>${receivedAt}</p>
    `;
    response.send(content);
});
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(p => p.id === id);
    if (person) {
        response.json(person);
    } else {
        response.sendStatus(404).end();
    }
});
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id);
    
    response.sendStatus(204).end();
});

const generateId = () => {
    let newId = null;
    do {
        newId = Math.random() * 10000;
    } while (persons.some(p => p.id === newId));
    return String(newId);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if (body.name && body.number) {
        const personExists = persons.some(p => p.name === body.name);
        if (personExists) {
            return response.status(400).json({
                error: 'person already exists'
            });
        }
        const newEntry = {
            name: body.name,
            number: body.number,
            id: generateId()
        }
        persons = persons.concat(newEntry);
        response.json(newEntry);
    } else {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})