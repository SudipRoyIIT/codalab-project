import mongoose from 'mongoose';

const { Schema } = mongoose;

const patentSchema = new Schema({
  status: {
    type: String,
    enum: ['Granted', 'Filed'],
    required: true,
    description: 'must be a string ,is required and will be one of the enum value'
  },
  serialno: {
    type: Number,
    required: true,
    description: 'must be an integer value and is required'
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
  date: {
    type: Date,
    default: null,
    description: 'must be a date'
  },
  pages: {
    type: String,
    default: '',
    description: 'must be a string'
  },
  patent_number: {
    type: String,
    default: '',
    description: 'must be a string'
  },
  application_number: {
    type: String,
    default: '',
    description: 'must be a string'
  },
  publisher: {
    type: String,

    default: '',
    description: 'must be a string'
  },
  weblink: {
    type: String,
    default: '',
    description: 'must be a string and will be the url'
  },
  additionalInfo: {
    type: String,
    default: '',
    description: 'must be a string'
  }
}, { additionalProperties: true });

const Patents = mongoose.model('Patents', patentSchema);

export default Patents;
