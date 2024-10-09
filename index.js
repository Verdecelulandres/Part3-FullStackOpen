const express = require ('express');
const morgan = require('morgan');
const app = express();

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
morgan.token('contact', (req) => JSON.stringify({name: req.body.name, number: req.body.number}));

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'));


//GET requests----------------------

//Phonebook info
app.get('/info', (request, response)=>{
    const currentTime = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`);
});
//Returns all contacts
app.get('/api/persons', (request, response) =>{
    response.json(persons);
});
//Returns single contact by id
app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id;
    const person = persons.find(p => p.id === id);
    if(person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

//POST requests-------------------------
app.post('/api/persons', (request, response) =>{
    const body = request.body;
    const hasName = persons.some(p => p.name === body.name);
    const hasNumber = persons.some(p => p.number === body.number);
    if(!body.name){
        return response.status(400).json({error: 'name missing'});
    } else if(!body.number){
        return response.status(400).json({error: 'number missing'});
    } else if(hasName) {
        return response.status(400).json({error: 'name must be unique'});
    } else if(hasNumber) {
        return response.status(400).json({error: 'number must be unique'});
    }
    const person = {
        id: String(Math.floor(Math.random()*100000)),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person);
    response.json(person);
});


//DELETE requests------------------------------
//deletes specified person by id
app.delete('/api/persons/:id', (request, response) =>{
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});