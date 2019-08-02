const express = require('express');
const routes = require('./routes');
// << var, const, let에 대해서 >>
// 우선 ES5까진 var만 있었음. ES6부터 const, let이 추가됨

// 차이1. scope
// var -> function-scope : 선언된 함수 안에서 유효(스크립트 전체에 쓰면 전역변수 되는듯)
// const, let -> block-scope : block은 { }를 말함.

// 차이2. 재선언 여부
// 자바스크립트에 var 밖에 없었을때 욕 많이 먹었음
// var a = 'test1'
// var a = 'test2'
// 이런게 가능해서. 불변성이 없어서.
// 근데 const, let은 이런 같은 이름 변수 재선언이 불가능함.
// cosnt vs let은 변수 재할당 여부임.
// const b = 'test1'
// b = 'test2' --> 에러
// let c = 'test1'
// c = 'test2' --> 가능.
// const는 진짜 안바꿀 상수에만 써라 이거임.


const app = express();
const port = 4000;

app.get('/', (req, res) => res.json({hello: 'hi3s~'}));
// app.get(path, callback [, callback ...])
// Routes HTTP GET requests to the specified path with the specified callback functions.
// from >> https://expressjs.com/ko/api.html#app.get
app.use('/streamer', routes.streamer);
app.use('/video', routes.video);

app.listen(port, console.log(`TCA3 start on port ${port}`));