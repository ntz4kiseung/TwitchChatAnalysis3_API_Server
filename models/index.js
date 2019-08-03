const mongoose = require('mongoose');

mongoose.set('debug', true);

mongoose.Promise = global.Promise;
// 몽구스 자체적으로도 promise를 쓰는데 몽구스의 기본 promise를
// node js의 promise로 대체하겠다는 거임.

mongoose.connect('mongodb://localhost/TCA3', {useNewUrlParser: true});

const Streamer = require('./streamer');
const Video = require('./video');

module.exports = {Streamer, Video};