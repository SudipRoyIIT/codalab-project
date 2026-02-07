import mongoose from 'mongoose';

const { Schema } = mongoose;

const BooksSchema = new Schema({
  serialno: {
    type: Number,
    required: true,
    description: 'Must be an integer value'
  },
  authors: {
    type: [String],
    required: true,
    description: 'Must be an array of strings and is required'
  },
  title: {
    type: String,
    required: true,
    description: 'Must be a string and is required'
  },
  additionalInfo: {
    type: String,
    default:"",
    description: 'Must be a string'
  },
  ISBN: {
    type: String,
    default:"",
    description: 'Must be a string and will follow the ISBN pattern'
  },
  volume: {
    type: String,
    default: "",
    description: 'Must be a string or null'
  },
  pages: {
    type: String,
    default: "",
    description: 'Must be a string or null'
  },
  publishingDate: {
    type: Date,
    required: true,
    description: 'Must be a date and is required'
  },
  publisher: {
    type: String,
    default: null,
    description: 'Must be a string'
  },
  weblink: {
    type: String,
    default: null,
    description: 'Must be a string and will be the URL'
  }
}, { additionalProperties: true });

const Books = mongoose.model('Books', BooksSchema);

export default Books;
