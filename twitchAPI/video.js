const db = require('../models');
const fetch = require('node-fetch');

const header = {
    'Client-ID': '3ruypxbpewihfy9b6t3zsa1m96bjel',
    'Accept': 'application/vnd.twitchtv.v5+json'    
};
const divideSec = 120;

// 최종 결과로 
// {
//     content_offset_seconds: '~~',
//     body: '~~'
// }
// 이것만 잔뜩 담긴 배열[]을 리턴함 videoId는 이거 부른데에도 있으니까 괜찮겠지?
const getAllComments = async (videoId) => {
    const video = await getVideo(videoId);
    const length = video.length;
    let bundlePromiseArray = [];

    for(let i=0; i<length/divideSec; i++){
        let startSec = i*divideSec;
        bundlePromiseArray.push(getCommentsBundle(videoId, startSec));
    }

    var bundleArray = await Promise.all(bundlePromiseArray).then(result => result);
    bundleArray.sort((a,b)=>(a.startSec - b.startSec));
    var result = [];
    bundleArray.map(bundle => (bundle.comments.map(comment => result.push(comment))));
    console.log('작업끝!', result.length);
    return result;
}

// startSec ~ ( startSec + divideSec ) 까지의 코멘트 번들을 리턴해줌
// 이 번들 안에선 정렬이 되있겠지
// 번들 내부에서 do~while 도는데 종료조건은 2가지임. 
// comments의 마지막 second가 bundle의 경계를 넘었거나 _next가 없는것.
// 그런데 bundle의 경계에서 comment가 중복되는 문제 때문에 bundle의 경계를 넘는 comment는 없애는 처리를 했음
// 그리고 없앤 comments의 cursorOrSecond를 null로 둠.
// undefined도 null로 검사 되는것 같으나 일단 둘다 검사해놓음
const getCommentsBundle = async (videoId, startSec) => {
    var bundle = {
        startSec: startSec,
        comments: []
    };
    var cursorOrSecond = startSec;
    do {
        var comments = await getComments(videoId, cursorOrSecond);
        cursorOrSecond = comments._next;

        // 번들 사이 중복 제거용 -> comments bundle의 마지막 comments에서 검사
        if((getSecond(lastComment(comments.comments)) > startSec+divideSec)){
            for(var i=0; i < comments.comments.length; i++){
                // bundle의 마지막 comments 돌다가 번들 경계선 넘는데 발견하면 그 뒤로 자름
                if(getSecond(comments.comments[i])>startSec+divideSec){
                    comments.comments=comments.comments.slice(0, i);
                    cursorOrSecond=null;
                    break;
                }
            }
        };

        comments.comments.map(comment => {
            bundle.comments.push({
                content_offset_seconds: getSecond(comment),
                body: getCommentBody(comment)
            })
        });
        
    } while ( !( (cursorOrSecond==undefined) || (cursorOrSecond==null) ) );
    console.log('한 뭉치 done!');
    return bundle;
};


// Twitch에 직접 다녀오는 함수1
const getVideo = async (videoId) => {
    return fetch(`https://api.twitch.tv/kraken/videos/${videoId}`,{
        method: 'GET',
        headers: header
    }).then(res => res.json())
    .catch(err => console.log(err));
};
// Twitch에 직접 다녀오는 함수2
const getComments = async (videoId, cursorOrSecond) => {
    let param ='';
    if(typeof cursorOrSecond == 'string'){
        param=`cursor=${cursorOrSecond}`;
    }else if (typeof cursorOrSecond == 'number' ){
        param=`content_offset_seconds=${cursorOrSecond}`;
    };

    return fetch(`https://api.twitch.tv/kraken/videos/${videoId}/comments?${param}`,{
        method: 'GET',
        headers: header
    }).then(res => res.json())
    .catch(err => console.log(err));
}


// 간단하지만 그냥 코드 간결해지라고 만든 거
const lastComment = (comments) => {
    return comments[comments.length-1];
}
const getSecond = (comment) => {
    return comment.content_offset_seconds;
}
const getCommentBody = (comment) => {
    return comment.message.body;
}




 getAllComments('458976246');