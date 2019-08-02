const mongoose = require('mongoose');

const videoThumbnailSchema = new mongoose.Schema({
    userId: String,
    videoId: String,
    thumbnail: String,
    title: String
});

const streamerSchema = new mongoose.Schema({
    userId: String,
    displayName: String,
    name: String,
    desc: String,
    logo: String,
    followers: Number,
    totalViews: Number,
    videoThumbnails: [videoThumbnailSchema]
});

module.exports = mongoose.model('Streamer', streamerSchema);
