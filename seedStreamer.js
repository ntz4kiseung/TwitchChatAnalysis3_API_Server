const db =require('./models');

const streamers = [
    {
        userId: '66375105',
        displayName: '침착맨',
        name: 'zilioner',
        desc: '제발 한국사람이라면 침투부 봅시다',
        logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/89e29e2e-f165-40e6-bc0c-d42205935216-profile_image-300x300.png',
        followers: 338286,
        totalViews: 19991828,
        videoThumbnails: [
            {
                userId: '66375105',
                videoId: 'v461310592',
                thumbnail: 'https://vod-secure.twitch.tv/_404/404_processing_320x180.png',
                title: '침투부 안보이는 아침라디오 (후원음성X)'
            },
            {
                userId: '66375105',
                videoId: 'v460993970',
                thumbnail: 'https://static-cdn.jtvnw.net/s3_vods/21a511b6c19b9a790c28_zilioner_35124000656_1263921704/thumb/thumb0-320x180.jpg',
                title: '침착맨&옥냥이 지렁이싸움 (후원음성X)'
            },
            {
                userId: '66375105',
                videoId: 'v460820836',
                thumbnail: 'https://static-cdn.jtvnw.net/s3_vods/f374af6f8f389ec8e572_zilioner_35119166432_1263619473/thumb/thumb0-320x180.jpg',
                title: '아침라디오 왕십리로 날아온 편지 (후원음성X)'
            },
            {
                userId: '66375105',
                videoId: 'v460052020',
                thumbnail: 'https://static-cdn.jtvnw.net/s3_vods/5f9b322d9ae9f0e864e7_zilioner_35098301424_1262315117/thumb/thumb0-320x180.jpg',
                title: '침&펄 디아블로3 하드코어 대작전 Act.2 (후원음성X)'
            },
            {
                userId: '66375105',
                videoId: 'v459923976',
                thumbnail: 'https://static-cdn.jtvnw.net/s3_vods/6f99c1a912216f53c922_zilioner_35094793072_1262095808/thumb/thumb0-320x180.jpg',
                title: '침&펄 작은거인 임세모 신곡 쇼케이스 "생각에 대한 생각" (후원음성X)'
            }
        ]
    },
    {
        userId: '103825127',
        displayName: '풍월량',
        name: 'hanryang1125',
        desc: '',
        logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/hanryang1125-profile_image-58261d78af47d249-300x300.jpeg',
        followers: 396464,
        totalViews: 62624577,
        videoThumbnails: []
    } 
]

const seedStreamer = async () => {
    try{
        await db.Streamer.remove();
        console.log('Drop all Streamers');

        await Promise.all(
            streamers.map(async streamer => {
                const data = await db.Streamer.create(streamer);
                await data.save();
            })
        )
    }catch(err){
        console.log(err);
    }
}

seedStreamer();