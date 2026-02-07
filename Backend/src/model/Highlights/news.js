import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    newsTopic: {
        type: String,
        required: true,
        description: "must be a string and is required"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        description: "must be a date"
    },
    newsDescription: {
        type: String,
        required: true,
        description: "must be a string and is required"
    },
    urlToImage: {
        type: String,
        required: true,
        description: "must be a string and will be the image url which is required"
    },
    url: {
        type: String,
        required: true,
        description: "must be a string, will be the url and is required"
    },
    updatedAt: {
        type: Date,
        description: "must be a date"
    }
}, {
    versionKey: false,
    timestamps: true
});

const news = mongoose.model('news', newsSchema);

export default news;
