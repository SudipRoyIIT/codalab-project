import mongoose from 'mongoose';

const { Schema } = mongoose;

const AwardsHonoursSchema = new Schema({
    field: {
        type: String,
        enum: ['Awards And Fellowships', 'Invited Talks'],
        required: true,
        description: 'must be a string, is required and will be one of the enum values'
    },
    additionalInfo: {
        type: String,
        required: true,
        description: 'must be a string'
    }
}, {
    strict: false,
    versionKey: false,
    additionalProperties: true
});

export default mongoose.model('awardsandtalks', AwardsHonoursSchema);