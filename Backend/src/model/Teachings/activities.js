import mongoose from 'mongoose';

const { Schema } = mongoose;

const activitySchema = new Schema({
  activity_name: {
    type: String,
    required: true,
    enum: [
      'Major Services in IIT Roorkee',
      'Outreach From Research Activities',
      'Professional Memberships and Affiliations'
    ],
    description: 'must be a string, is required and will be one of the enum values'
  },
  details: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  }
}, {
  additionalProperties: true,
  versionKey: false
});

const activity = mongoose.model('activity', activitySchema);

export default activity;