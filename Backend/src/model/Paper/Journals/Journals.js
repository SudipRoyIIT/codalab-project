import mongoose from 'mongoose';

const { Schema } = mongoose;

const journalSchema = new Schema({
  serialno: {
    type: Number,
    required: true,
    description: 'must be an integer and is required'
  },
  authors: {
    type: [String],
    required: true,
    description: 'must be an array of items and is required'
  },
  title: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  journal: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  volume: {
    type: Number,
    required: false,
    default: null,
    description: 'must be an integer value and is required'
  },
  pages: {
    type: String,
    required: false,
    default:"",
    description: 'must be a number and is required'
  },
  publishedOn: {
    type: Date,
    required: true,
    description: 'must be a date and is required'
  },
  DOI: {
    type: String,
    required: false,
    default:"",
    description: 'must be a string and is required'
  },
  IF: {
    type: Number,
    required: false,
    default: null,
    description: 'must be a number and is required'
  },
  SJR: {
    type: String,
    required: false,
    default:"",
    description: 'must be a string and is required'
  },
  additionalInfo: {
    type: String,
    required: false,
    default:"",
    description: 'must be a string and is required'
  }
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
 
});

// Custom validation to ensure volume, pages, IF, SJR, and additionalInfo are not empty before saving


const Journal = mongoose.model('Journals', journalSchema);

export default Journal;
