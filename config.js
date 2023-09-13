module.exports = {
    PORT: 80,
    SEARCH_OPTS: {
        maxResults: 15,
        key: 'YOUTUBE-API-KEY',
        pageToken: ''
    },
    YOUTUBE: {
        ffmpegPath: '/usr/local/bin/ffmpeg',
        quality: 'highest',
        downloadDir: './public/downloads',
    }
}
