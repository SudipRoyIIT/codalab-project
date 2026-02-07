import mongoose from 'mongoose';
const { Schema } = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
    description: 'must be a string and must be required'
  },
  enrolledCourse: {
    type: String,
    enum: ['M.Tech', 'PhD'],
    required: true,
    description: 'can only be one of the enum values and is required'
  },
  subtitle: {
    type: String,
    description: 'must be a string'
  },
  domain: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  graduatingYear: {
    type: Number,
    required: true,
    description: 'must be an integer value and is required'
  },
  areaOfInterest: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  urlToImage: {
    type: String,
    required: true,
    description: 'must be a string and will be the url of the image of the student'
  },
  overview: {
    type: String,
    required: true,
    description: 'must be a string and will be the overview of the student'
  },
  researches: {
    type: String,
    required: true,
    description: 'must be a string and includes the researches done by the student'
  },
  contactInformation: {
    email: {
      type: String,
      required: true,
      description: 'must be a string and is required'
    },
    googleScholarLink: {
      type: String,
      description: 'must be a string and will be the url'
    },
    orcidLink: {
      type: String,
      description: 'must be a string and will be the url'
    },
    linkedLink: {
      type: String,
      description: 'must be a string and will be the url'
    },
    clickForMore: {
      type: String,
      description: 'must be a string and will be the url'
    },
    researchGateId: {
      type: String,
      description: 'must be a string and will be the url'
    }
  }
}, {
  additionalProperties: true,
  versionKey: false
});

const student = mongoose.model('student', studentSchema);
export default student;