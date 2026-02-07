import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        description: "must be a date and is required"
    },
    topicOfAnnouncement: {
        type: String,
        required: true,
        description: "must be a string and is required"
    },
    readMore: {
        type: String,
        required: true,
        description: "must be a string and will be the url of the announcement"
    }
}, {
    versionKey: false,
    collection: 'announcements'
});

const announcement = mongoose.model('announcement', announcementSchema);

export default announcement;
