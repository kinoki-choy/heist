const db = require('./store.js')
    , config = require('./config.js')
    , rsync = require('./rsync.js')
    , fs = require('fs-extra')
    , path = require('path')
    , child = require('child_process')
    , search = require('youtube-search')
    , bodyParser = require('body-parser')
    , calDuration = require('get-mp3-duration');

const express = require('express')
    , app = express()
    , http = require('http').Server(app)
    , io = require('socket.io')(http);

app.io = io;
app.set('view engine' , 'pug');
app.use(bodyParser.json());
app.use('/static', express.static('public'));
app.locals.moment = require('moment');
app.locals.downloadQue = {};
app.locals.pretty = true;
db.ensureIndex({ fieldName: 'id', unique: true }, (err) => {});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/search', (req, res) => {
    let query = req.query.q;
    if (!query) { res.redirect('/') };

    let opts = config.SEARCH_OPTS;
    opts.pageToken = req.query.offset;

    search(query, opts, (err, results, pageInfo) => {
        if (err) return console.log(err.message);
        var payload = {
          query: query,
          title: query,
          results: results,
          pageInfo: pageInfo,
          nextPageUrl: `/search?q=${query.split(' ').join('+')}&offset=${pageInfo.nextPageToken}`}
        res.render(req.xhr ? '_results.pug' : 'index.pug', payload);
    });
});

app.post('/download', (req, res) => {
    let _id = req.body.youtube_id;
    if (!_id) { res.redirect('/') };

    let _title = req.body.title;
    let download = child.spawn(`node youtube.js ${_id} moveCursorDisable`, { shell: true });

    db.insert({ id: _id, sta: 'Downloading', title: _title }, (err, newDoc) => {
        app.locals.downloadQue[_id] = { title: _title, sta: 0 };
        io.emit('download_que', app.locals.downloadQue);
    });

    download.stdout.on('data', (data) => {
        io.emit('download_progress', { id: _id, sta: data.toString() });
    });

    download.on('close', (code) => {
        let status,duration;

        if (code == 0) {
            status = 'completed';
            duration_ms = calDuration(fs.readFileSync(`${config.YOUTUBE.downloadDir}/${_id}.mp3`));
            duration = (duration_ms/(60*1000)).toFixed(2);
        } else {
            status = 'failed';
        };

        db.update({ id: _id }, { $set: { sta: status, drn: duration }}, { multi: false }, (err, numReplaced) => {
            delete app.locals.downloadQue[_id];
            io.emit('download_progress', { id: _id, sta: code });
            io.emit('download_que', app.locals.downloadQue);
        });
    });
});

app.get('/music', (req, res) => {
    let order_by = req.query.order || 'artist';
    let sort = req.query.sort == 'asc' ? 'desc' : 'asc'
    let sort_params = { [order_by]: [sort] == 'asc' ? 1 : -1 };

    db.find({}).sort(sort_params).exec((err, docs) => {
        res.render('music.pug', {
            docs: docs,
            sort: sort,
            nav_class: 'is-one-quarter'
        });
    });
});

app.post('/music', (req, res) => {
    var params = {};
    if (req.body.artist) { params.artist = req.body.artist };
    if (req.body.title) { params.title = req.body.title };

    db.update({ id: req.body.id }, { $set: params}, { multi: false }, (err, numReplaced) => {
        res.send({ [req.body.id]: { msg: 'ok' } });
    });
});

app.delete('/music', (req,res) => {
    let youtube_id = req.body.youtube_id;
    db.remove({ id: youtube_id }, {}, (err, numRemoved) => {
        fs.remove(`${config.YOUTUBE.downloadDir}/${youtube_id}.mp3`)
        .then(() =>{
            res.send({ msg: 'ok' });
        });
    });
});

app.get('/sync', (req, res) => {
    db.find({ sta: 'completed' }, {id: 0, sta: 0, drn: 0, _id: 0}, (err, docs) => {

        var results = docs.reduce((acc, currValue) => {
            acc[currValue.artist] = acc[currValue.artist] || [];
            acc[currValue.artist].push(currValue);
            return acc;
        }, Object.create(null));

        res.render('sync.pug', {
            docs: results,
            songs_count: docs.length
        });
    });
});

app.post('/sync', (req, res) => {
    db.find({ sta: 'completed' }, (err, songs) => {
        fs.emptyDirSync('tmp');
        for (let song of songs) {
            fs.copySync(`${config.YOUTUBE.downloadDir}/${song.id}.mp3`, `tmp/Heist/${song.artist}/${song.title}.mp3`);
        };

        rsync.adbConnectShell().stderr.on('data', (data) => {
            io.emit('sync', data.toString());
        });

        rsync.toAndroid().stdout.on('data', (data) => {
            io.emit('sync', data.toString());
        });
        res.send({ msg: 'ok' });
    });
});

http.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`)
});
