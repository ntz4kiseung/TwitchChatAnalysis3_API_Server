const fetch = require('node-fetch');
const db = require('../models');
const mongoose = require('mongoose');

const header = {
    'Client-ID': '3ruypxbpewihfy9b6t3zsa1m96bjel',
    'Accept': 'application/vnd.twitchtv.v5+json'    
};

// name을 Id로 바꿔줌
const nameToId = async (userName) => {
    const json = await fetch( `https://api.twitch.tv/kraken/users?login=${userName}`, {
        method: 'GET',
        headers: header
    }).then(res => res.json())
    .catch(err => console.log('err') );
    if(json._total == 0){
        return 'StreamerNotFound';
    }else{
        return json.users[0]._id;
    }
};

// Promise를 리턴하며 async함수 안에서
// var temp = await findStreamer('woowakgood')
// temp.users[0] 하면 됨
// displayName, name, desc, logo url 있음
const findStreamer = async (userName) => {
    const userId = await nameToId(userName);
    if(userId == 'StreamerNotFound'){
        return 'StreamerNotFound';
    }else{
        return fetch( `https://api.twitch.tv/kraken/channels/${userId}`, {
            method: 'GET',
            headers: header
        }).then((res) => res.json()).catch((err) => console.log(err));
    }
};

// findStreamer의 결과인 twitch에서 fetch해온 Streamer객체를 받음
const saveStreamer = async (streamer) => {
    const saveStreamer = await db.Streamer.create({
        userId: streamer._id,
        displayName: streamer.display_name,
        name: streamer.name,
        desc: streamer.description,
        logo: streamer.logo,
        followers: streamer.followers,
        totalViews: streamer.views,
        videoThumbnails: []
    });
    // await saveStreamer.save();
    // 몽구스의 save()는 필드값 비교해서 바뀐거 있으면 저장해주는거임. 덮어쓰기 비슷한거. 그래서 여기선 할 필요 없음.
    return saveStreamer;
}


// db에서 가져온 streamer와
// twitch에서 fetch해온 video를 받는다. (이 스트리머에 이 video 썸네일 추가)
const pushThumbnail = async (streamer, video) => {
    const videoThumbnail = {
        userId: `${video.channel._id}`,
        videoId: `${video._id}`,
        thumbnail: video.thumbnails.medium[0].url,
        title: video.title        
    };
    streamer.videoThumbnails.push(videoThumbnail);
    streamer.save();
}

const videoThumbnailSchema = new mongoose.Schema({
    userId: String,
    videoId: String,
    thumbnail: String,
    title: String
});

module.exports = {findStreamer, nameToId, saveStreamer, pushThumbnail};