const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')


morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

const generateNumber = number => {
    if (number === "") {
        min = Math.ceil(100000)
        max = Math.floor(999999)
        const endNumbers = Math.floor(Math.random() * (max - min + 1) + min)
        return (`040-${endNumbers}`) 
    } else {
        return number
    }
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
    response.send('<h1>Phonebook</h1>')
})

app.get('/info', (request, response) => {
    const date = new Date()
    const numberOfPersons = persons.length
    response.send(`<p>Phonebook has info for ${numberOfPersons} people</p>\n${date}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = findPersonById(id)

    if (person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body.number)

    const person = {
        id: generateID(),
        name: body.name,
        number: generateNumber(body.number)
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

    response.json(person)
}) 

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
