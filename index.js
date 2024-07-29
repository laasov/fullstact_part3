const express = require('express')
const morgan = require('morgan')

morgan.token('body', function getBody (req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ""
})

const app = express()
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(express.json())
app.use(logger)

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

    const newId = () => {
        const tmpId = Math.random() * 10e6
        const id = Math.round(tmpId)
        return id
    }

    if (!body.name || !body.number)  {
        return res.status(400).json({ 
          error: 'Name or number missing' 
        })
    }

    if (phonebook
            .map(e => e.name === body.name)
            .some(e => e === true)
        ) {
        return res.status(400).json({ 
            error: 'Name must be unique' 
          })
    }
    
    const rec = {
        id: newId(),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(rec)
    res.json(rec)

})

app.get('/api/persons', (req, res) => {
    res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const data = phonebook.find(e => e.id === id)
    if (data) {
        res.json(data)
    } else {
        res.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    phonebook = phonebook.filter(e => e.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})