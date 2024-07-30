require('dotenv').config()

const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('Connecting to database...')

mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {console.log('Error connecting to MongoDB:', error.message)})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must have at least 3 letters'],
    required: [true, 'Name required']
  },
  number: {
    type: String,
    minLength: [8, 'Phone number must have at least 8 letters'],
    validate: {
      validator: (v) => /\d{3}-\d|\d{2}-\d/.test(v),
      message: props => `${props.value} is not a valid phone number`,
      required: [true, 'Phone number required']
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)