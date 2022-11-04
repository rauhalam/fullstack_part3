const express = require('express')
const app = express()
const baseUrl = 'localhost:3001'

app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
]

const generateID = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

const generateNumber = () => {
    min = Math.ceil(100000)
    max = Math.floor(999999)
    const endNumbers = Math.floor(Math.random() * (max - min + 1) + min)
    return (`040-${endNumbers}`)
}

const findPersonById = id => {
    const person = persons.find(person => person.id === id)
    return person
}

const findPersonByName = name => {
    const person = persons.find(person => person.name === name)
    if (person) {
        return person   
    } else {
        return ""
    }
}

app.get('/', (request, response) => {
    console.log('GET localhost:3001')
    response.send('<h1>Phonebook</h1>')
})

app.get('/info', (request, response) => {
    console.log(`GET ${baseUrl}/info`)
    const date = new Date()
    const numberOfPersons = persons.length
    response.send(`<p>Phonebook has info for ${numberOfPersons} people</p>\n${date}`)
})

app.get('/api/persons', (request, response) => {
    console.log(`GET ${baseUrl}/api/persons`)
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = findPersonById(id)
    console.log(person)
    console.log(`GET ${baseUrl}/api/persons/${id}`)

    if (person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(`DELETE ${baseUrl}/api/persons/${id}`)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    console.log(`POST ${baseUrl}/api/persons`)
    const body = request.body

    const person = {
        id: generateID(),
        name: body.name,
        number: generateNumber(),
    }

    const compare = findPersonByName(person.name)

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'Content missing'
        })
    } 
    if (person.name === compare.name) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    persons = persons.concat(person)
    console.log(persons)

    response.json(person)
}) 

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
