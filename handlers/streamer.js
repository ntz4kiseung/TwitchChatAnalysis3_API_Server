const db = require('../models');
const twitch = require('../twitchAPI');


const testStreamer = async(req, res, next) => {
    res.status(200).json({streamer : 'hi'});
};

const getStreamer = async(req, res, next) => {
    const {name} = req.params;
    const userId = await twitch.nameToId(name);
    res.set('Access-Control-Allow-Origin','*');

    if(userId==='StreamerNotFound'){
        // 아예 트위치에 스트리머 이름이 없는 경우
        console.log('Stremaer twitch에 없다!');
        res.status(200).json({name: 'StreamerNotFound'});        
    }else{
        // 트위치에 있으면 db에서 찾아봄
        let streamer = await db.Streamer.findOne({userId : userId});

        if(streamer===null){
            // db에도 없다면 -> 스트리머 디테일 정보 찾아서 저장 후 다시 찾아서 돌려보냄
            console.log('Stremaer db에 없다! 저장하고 보여준다!');
            streamer = await twitch.findStreamer(name); // 디테일 정보 찾음
            const saveStreamer = await twitch.saveStreamer(streamer); // 저장함

            res.status(200).json(saveStreamer);
        }else{
            // db에 있다면
            console.log('Stremaer db에 있다!')
            res.status(200).json(streamer);
        }
    }
}

module.exports = {testStreamer, getStreamer};
