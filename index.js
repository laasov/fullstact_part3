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

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(people => {
            res.send(
                `
                <!DOCTYPE html>
                <html lang="en">
                  <body>
                    <div>
                      <p>Phonebook has info for ${people.length} people</p>
                      <p>${new Date()}</p>
                    </div>
                  </body>
                </html>
                `
            )
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

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
        .then(person => person ? res.json(person) : res.status(404).end())
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndDelete(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const data = {name: body.name, number: body.number}
    Person
        .findByIdAndUpdate(req.params.id, data, {new: true})
        .then(updated => res.json(updated))
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const badId = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'bad id' })
    }

    next(error)
}

app.use(badId)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})