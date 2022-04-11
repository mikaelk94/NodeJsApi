const mongoose = require('mongoose')

const postingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    price: {
      type: String,
      required: true,
    },
    deliveryType: {
      shipping: Boolean,
      pickup: Boolean,
    },
    contactInfo: {
      firstName: { type: String, required: true },
      phoneNum: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
)

postingSchema.path('images').validate((images) => {
  if (images.length > 4) {
    throw new Error("Posting can't contain more than 4 images")
  }
})

postingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Posting', postingSchema)
