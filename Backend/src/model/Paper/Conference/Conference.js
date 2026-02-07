import mongoose from 'mongoose';

const { Schema } = mongoose;

const conferenceSchema = new Schema({
  serialno: {
    type: Number,
    required: true,
    description: 'must be an integer value'
  },
  authors: {
    type: [String],
    required: true,
    description: 'must be an array of items'
  },
  title: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  conference: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  location: {
    type: String,
    default:"", // Default value is an empty string
    description: 'must be a string'
  },
  date: {
    type: Date,
    required: true,
    description: 'must be a string and is required'
  },
  ranking: {
    type: String,
    default:"", // Default value is an empty string
    description: 'must be a string'
  },
  DOI: {
    type: String,
    default:"", // Default value is an empty string
    description: 'must be a string'
  },
  pages: {
    type: String,
    default:"", // Default value is an empty string
    description: 'must be a string'
  },
  additionalInfo: {
    type: String,
    default:"", // Default value is an empty string
    description: 'must be a string'
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

const Conference = mongoose.model('Conference', conferenceSchema);

export default Conference;
