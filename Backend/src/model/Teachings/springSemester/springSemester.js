import mongoose from 'mongoose';

const springSemesterSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    match: /^[0-9]{4}-[0-9]{4}$/,
    description: 'must be a string and match the pattern YYYY-YYYY'
  },
  courses: {
    type: [
      {
        subjectCode: {
          type: String,
          required: true,
          description: 'must be a string and is required'
        },
        subjectName: {
          type: String,
          required: true,
          description: 'must be a string and is required'
        },
        studentsStrength: {
          type: Number,
          required: true,
          description: 'must be an integer value and is required',
          validate: {
            validator: Number.isInteger,
            message: 'studentsStrength must be an integer'
          }
        },
        additionalInfo: {
          type: String,
          description: 'must be a string, is optional and can include the information about the instructor'
        }
      }
    ],
    required: true,
    description: 'must be an array of course objects and is required'
  }
}, { additionalProperties: true });

const springSemester = mongoose.model('springSemester', springSemesterSchema);

export default springSemester;
