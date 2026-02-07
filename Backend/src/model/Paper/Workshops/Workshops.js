// workshopsSchema.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const WorkshopsSchema = new Schema({
  serialno: {
    type: Number,
    required: true,
    description: 'must be an integer value'
  },
  names: {
    type: [String],
    required: true,
    description: 'must be an array of strings'
  },
  title: {
    type: String,
    required: true,
    description: 'must be a string'
  },
  workshop: {
    type: String,
    required: true,
    description: 'must be a string'
  },
  pages: {
    type: String,
    default:"",
    description: 'must be an integer or null'
  },
  location: {
    type: String,
    default:"",
    description: 'must be a string'
  },
  year: {
    type: Number,
    required: true,
    default: null,
    description: 'must be a number or null'
  },
  weblink: {
    type: String,
    required: true,
    default:"",
    description: 'must be a string and will be the URL'
  },
  ranking: {
    type: String,
    default:"",
    description: 'must be a string'
  },
  awardedBy: {
    type: String,
    default:"",
    description: 'must be a string'
  },
  additionalInfo: {
    type: String,
    default:"",
    description: 'must be a string'
  }
});

const Workshops = mongoose.model('Workshops', WorkshopsSchema);

export default Workshops;
