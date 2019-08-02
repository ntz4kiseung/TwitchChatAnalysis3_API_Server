const fetch = require('node-fetch');

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

module.exports = {findStreamer, nameToId};

// const test = async () => {
//     var temp = await findStreamer('woowakgood');
//     console.log(temp);
// };

// test();