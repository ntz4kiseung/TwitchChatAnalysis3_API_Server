module.exports.streamer = require('./streamer');
module.exports.video = require('./video');
// module.exports vs export default
// javscript에서 export 하는 방법엔 위에 두가지,
// import 하는 방법엔 require, import 두가지가 있다.
// module.exports와 require가 더 오래된방식. 그래서 VSC에서 계속 ES6버젼으로 쓰라고 추천뜨는거임.

// var a = require('./something');
// module.exports = a;

// import a from 'something';
// export default a;

// 이 두가지는 셋트라고 보는게 좋다. 내보낼때 export default를 썼으면
// 받을때 import로 받고
// module.exports로 내보냈다면 require로 받아라.
// 두개 작동하는 방식이 약간 다르단다. export로 보내면 한 번더 감싼다?
// 유튜브 강의에선 서버는 구버젼, 클라이언트는 신버젼 썼음.
// 여기 블로그에 잘 설명되어 있으니 참고하고 여기선 ES6방식으로 가보자.

// from >> https://jeff-til.tistory.com/entry/moduleexports-VS-export-default
