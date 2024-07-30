const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('some of required not found: password, name, phone number')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://issal:${password}@phonebookdb.uywwgqm.mongodb.net/?retryWrites=true&w=majority&appName=phonebookDb`

mongoose.set('strictQuery',false)
console.log('Connecting to ', url)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}