export default () => ({
    port: 5000,
    salt: 10,
    jwtSecret: '1asdk1j232984iojib5bvieurlk3',
    jwtRefreshSecret: 'asdyiuhiuh12u3h1iu23h127y3871hkjdnvkapso',
    database: {
        MONGO_URI: 'mongodb+srv://nazar:nazar123123@orion-io.ikdqk.mongodb.net/main-db?retryWrites=true&w=majority'
    }
})