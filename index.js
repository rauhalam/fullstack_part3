require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


/* const generateNumber = number => {
    if (number === "") {
        min = Math.ceil(100000)
        max = Math.floor(999999)
        const endNumbers = Math.floor(Math.random() * (max - min + 1) + min)
        return (`040-${endNumbers}`) 
    } else {
        return number
    }
} */

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

/* app.get('/info', (request, response) => {
    const date = new Date()
    const numberOfPersons = Person.estimatedDocumentCount()
    console.log(numberOfPersons)
    response.send(`<p>Phonebook has info for ${numberOfPersons} people</p>\n${date}`)
}) */

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'Name or number missing'
    })
  }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
