const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content_offset_seconds: Number,
    body: String
});

const videoSchema = new mongoose.Schema({
    userId: String,
    name: String,
    videoId: String,
    title: String,
    created_at: String,
    game: String,
    length: Number,
    url: String,
    comments: [commentSchema]
});

module.exports = mongoose.model('Video', videoSchema);