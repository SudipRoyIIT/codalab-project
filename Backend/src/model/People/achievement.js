import mongoose from 'mongoose';

const { Schema } = mongoose;

const AchievementSchema = new Schema({
  title: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  organised_by: {
    type: String,
    required: true,
    description: 'must be a string'
  },
  date: {
    type: Date,
    required: true,
    description: 'must be a date'
  },
  additionalInfo: {
    type: String,
    description: 'must be a string'
  }
}, { _id: false });

const AchievementByStudentsSchema = new Schema({
  name: {
    type: [String],
    required: true,
    description: 'must be an array of strings and is required'
  },
  department: {
    type: String,
    required: true,
    description: 'must be a string and is required'
  },
  achievement: {
    type: AchievementSchema,
    required: true,
    description: 'must be an object'
  }
}, {
  versionKey: false,
  additionalProperties: true
});

export default mongoose.model('achievement', AchievementByStudentsSchema);