import mongoose from 'mongoose';

const { Schema } = mongoose;

const MemoriesSchema = new Schema({
    photo_caption: {
        type: String,
        required: true,
        description: 'must be a string and is required'
    },
    urlToImage: {
        type: String,
        required: true,
        description: 'must be a string and will be the url of image'
    }
}, {
    strict: false,
    versionKey: false
});

export default mongoose.model('memories', MemoriesSchema);