const twitch = require('../twitchAPI');
const mongoose = require('mongoose');
const db = require('../models');

exports.testVideo = async (req, res, next) => {
    res.status(200).json({video: 'this is testVideo'});
};

// 트위치에 있는지, DB에 있는지
exports.getVideo = async (req,res,next) => {
    const videoId = req.params.videoId;
    const video = await twitch.getVideo(videoId);

    if(video==null || video.status==400 || video.status==404){
        res.status(200).json({
            type: 'NotFoundVideo',
            video: {videoId: `${videoId}`}
        });
    }else{
        // db엔 원래 트위치에서 가져오는 videoId 형식 v1245678 로 저장하되,
        // 찾을때는 url에 나와있는 1245678 로 찾음. 그래서 v${videoId} 여기 앞에 v 붙인거임 
        const streamer = await db.Streamer.findOne({ 'videoThumbnails.videoId': `v${videoId}`});
        if(streamer==null){
            res.status(200).json({
                type: 'NotAnalyedVideo',
                video: {videoId: `${videoId}`}
            });            
        }else{
            const returnVideo = await twitch.getCommentsCounting(`${videoId}`);
            res.status(200).json({
                type: 'FoundVideo',
                video: returnVideo
            });
        }
    }
};

// 바로 찾아서 보여줌 -> 이미 video가 있다는게 전제됨.
exports.searchKeyword = async (req, res, next) => {
    const returnVideo = await twitch.getCommentsSearchCounting(req.params.videoId, req.params.keyword);

    res.status(200).json({
        type: 'SearchKeyword',
        video: returnVideo
    });
};

// db에 없는 video만 넣어주는 함수(있으면 돌려보내는건 한번 더 막을지 말지 고민중)
// twitch에 video, streamer 모두 있는걸 전제
// DB에 해당 스트리머 있는지
exports.saveVideo = async (req,res,next) => {
    const videoId = req.params.videoId;
    const video = await twitch.getVideo(videoId);
    let streamer = await db.Streamer.findOne({userId: `${video.channel._id}`});
    if(streamer==null){
        // 없으면 스트리머부터 저장하고
        console.log('스트리머저장 in saveVideo');
        const twitchStreamer = await twitch.findStreamer(video.channel.name); // 디테일 정보 찾음
        await twitch.saveStreamer(twitchStreamer); // 저장함    
        streamer = await db.Streamer.findOne({userId: `${video.channel._id}`}); // 다시불러옴(thumbnail 저장할때 써야됨)
    };
    // video저장하고
    console.log('비디오 저장 in saveVideo');
    await twitch.saveVideo(await twitch.getAllComments(videoId));

    // 스트리머에 videoThumbnail추가하자
    console.log('썸네일 저장 in saveVideo');
    await twitch.pushThumbnail(streamer, video);

    res.status(200).json({
        type: 'VideoSaved',
        video: {
            video: {videoId: `${videoId}`}
        }
    })
};