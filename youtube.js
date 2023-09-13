const readline = require('readline')
    , youtubeConfig = require('./config.js').YOUTUBE
    , downloader = require('youtube-mp3-downloader');

const YD = new downloader({
    ffmpegPath: youtubeConfig.ffmpegPath,
    outputPath: youtubeConfig.downloadDir,
    youtubeVideoQuality: youtubeConfig.quality,
    queueParallelism: 10,
    progressTimeout: 800
});

function download(youtube_id, moveCursor) {
    YD.download(youtube_id, `${youtube_id}.mp3`);
    YD.on('progress', (info) => {
        var msg = `${parseInt(info.progress.percentage)}`;
        if (moveCursor == 'moveCursor') {
            readline.cursorTo(process.stdout, 0);
            msg += '%';
        };
    	process.stdout.write(msg);
    });
}

try {
    download(process.argv.slice(2)[0], process.argv.slice(2)[1]);
}
catch(err) {
    console.log(err.message);
}
