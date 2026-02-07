import mongoose from 'mongoose';

// Define the schema
const projectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
    description: "must be a string and is required"
},
typeOfProject: {
    type: String,
   default:"",
    description: "must be a string and is required"
},
roleInProject: {
    type: String,
    enum: ["PI", "Co-PI"],
    required: true,
    description: "must be a string and is required with the enum value only"
},
status:{
    type: Boolean,
    required: true,
    description: "must be a string and is required with the enum value only"
},
sponsors: {
    type: String,
    required: true,
    description: "must be a string and is required"
},
collaboration: {
    type: String,
    required: true,
    description: "must be a string and is required"
},
total_grant_inr: {
    type: String,
    description: "must be a string"
},
total_grant_usd: {
    type: String,
    description: "must be a string"
},
start_date: {
    type: Date,
    description: "must be a date"
},
end_date: {
    type: Date,
    default:null
    
},
date: {
    type: String,
    required: true,
    description: "must be a string and is required"
},
additionalInfo: {
    type: String,
    description: "must be a string"
}
}, { timestamps: true });
// Create a model
const Project = mongoose.model('Project', projectSchema);

// Export the model
export default Project;
