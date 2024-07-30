const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', function getBody (req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ""
})

const app = express()
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(express.json())
app.use(express.static('dist'))
app.use(logger)
app.use(cors())

let phonebook = [
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
]

app.get('/info', (req, res) => {
    res.send(
        `<div>
          <p>Phonebook has info for ${phonebook.length} people</p>
          <p>${new Date()}</p>
        </div>
        `
    )
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)

    if (!body.name || !body.number)  {
        return res.status(400).json({ 
          error: 'Name or number missing' 
        })
    }

    const record = new Person({
            name: body.name,
            number: body.number
    })

    record
        .save()
        .then(saved => {
            res.json(saved)
            console.log("Successfully added new person")
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(people => res.json(people))
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => res.json(person))
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    phonebook = phonebook.filter(e => e.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})