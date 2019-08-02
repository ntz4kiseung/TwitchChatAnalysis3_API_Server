const db = require('../models');
const fetch = require('node-fetch');

const header = {
    'Client-ID': '3ruypxbpewihfy9b6t3zsa1m96bjel',
    'Accept': 'application/vnd.twitchtv.v5+json'    
};

const getVideo = async (videoId) => {
    const video = await fetch(`https://api.twitch.tv/kraken/videos/${videoId}`,{
        method: 'GET',
        headers: header
    }).then(res => res.json())
    .catch(err => console.log(err));

    debugger;

};


module.exports = {getVideo};

getVideo('459479447');