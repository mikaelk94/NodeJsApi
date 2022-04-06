const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNum: {
      type: String,
      minlength: 5,
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    postings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posting',
      },
    ],
  },
  { timestamps: true }
)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('User', userSchema)
