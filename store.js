const Datastore = require('nedb'),

    datastore = new Datastore({
        filename: `${__dirname}/db/songs.db`,
        autoload: true
    });

module.exports = datastore;