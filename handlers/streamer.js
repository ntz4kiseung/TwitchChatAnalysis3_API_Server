const db = require('../models');
const twitch = require('../twitchAPI');


const testStreamer = async(req, res, next) => {
    res.status(200).json({streamer : 'hi'});
};

const getStreamer = async(req, res, next) => {
    const {name} = req.params;
    const userId = await twitch.nameToId(name);

    if(userId==='StreamerNotFound'){
        // 아예 트위치에 스트리머 이름이 없는 경우
        res.status(200).json({name: 'StreamerNotFound'});        
    }else{
        // 트위치에 있으면 db에서 찾아봄
        let streamer = await db.Streamer.findOne({userId : userId});
        if(streamer===null){
            // db에도 없다면 -> 스트리머 디테일 정보 찾아서 저장 후 다시 찾아서 돌려보냄
            streamer = await twitch.findStreamer(name); // 디테일 정보 찾음\
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
            res.status(200).json(saveStreamer);
        }else{
            // db에 있다면
            res.status(200).json(streamer);
        }

    }
    
}

module.exports = {testStreamer, getStreamer};
