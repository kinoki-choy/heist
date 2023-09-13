const SyncMusicStore = {
    init: function() {
        this.cacheDOM();
        this.bindEvents();
    },
    cacheDOM: function() {
        this.syncBtn = document.querySelector('.sync');
    },
    bindEvents: function() {
        this.syncBtn.addEventListener('click', this.sync.bind(this), false)
    },
    sync: function(e) {
        e.preventDefault();
        axios.post('/sync')
            .then(function() { document.querySelector('.log').innerHTML = ''; })
            .catch(function(error) { console.log(error); });
    }
}
