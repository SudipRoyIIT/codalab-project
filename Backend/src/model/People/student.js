import mongoose from 'mongoose';

const { Schema } = mongoose;

const ContactInformationSchema = new Schema({
  email: {
    type: [String],
    required: true,
    description: 'must be a string or an array of items and is required'
  },
  googleScholarLink: {
    type: String,
    description: 'must be a string and will be the url'
  },
  orcidLink: {
    type: String,
    description: 'must be a string and will be the url'
  },
  linkedIn: {
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
}, { _id: false });

const PublicationsSchema = new Schema({
  journal_publications: {
    type: [String],
    default: null,
    description: 'must be an array of items or the null value'
  },
  conference_publications: {
    type: [String],
    default: null,
    description: 'must be an array of items or the null value'
  }
}, { _id: false });

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  enrolledCourse: {
    type: String,
    enum: ['M.Tech', 'PhD'],
    required: true,
    description: 'can only be one of the enum values and is required'
  },
  subtitle: {
    type: String,
    default: null,
    description: 'must be a string or a null value'
  },
  domain: {
    type: String,
    required: function () { return this.enrolledCourse === 'M.Tech'; },
    description: 'must be a string and is required'
  },
  graduatingYear: {
    type: Number,
    required: function () { return this.enrolledCourse === 'M.Tech'; },
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
  thesis_title: {
    type: String,
    default: null,
    description: 'must be a string or null'
  },
  publications: {
    type: PublicationsSchema,
    description: 'must be an object'
  },
  contactInformation: {
    type: ContactInformationSchema,
    description: 'includes the contact information about the student'
  }
}, {
  additionalProperties: true,
  versionKey: false
});

export default mongoose.model('student', StudentSchema);