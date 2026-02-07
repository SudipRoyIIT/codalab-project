import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        description: "must be a date and is required"
    },
    eventDescription: {
        type: String,
        required: true,
        description: "must be a string and is required"
    },
    url: {
        type: String,
        description: "must be a string and will be the url"
    }
}, {
    versionKey: false,
    timestamps: true
});

const event = mongoose.model('event', eventSchema);

export default event;
