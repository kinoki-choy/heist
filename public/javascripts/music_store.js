const MusicStore = {
    init: function() {
        this.howl = {};
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('click', this.queSong.bind(this), false);
        document.addEventListener('dblclick', this.setEditable.bind(this), false);
        document.addEventListener('change', this.submitChanges.bind(this));
        window.addEventListener('keydown', this.hotKeysControls.bind(this));
    },
    queSong: function(e) {
        if (e.target.className.includes('song')) {
            var elem = e.target.closest('tr');
            this.hightlightSong(elem);
            this.setCurrentSong(elem);
            console.log(`%c ${elem.dataset.displayTitle}`, 'background: #f6f19c; color: #444');
        };
    },
    setEditable: function(e) {
        var elem = e.target;
        if (this.ifEditable(elem)) {
            elem.removeAttribute('readonly');
            elem.select();
        };
    },
    submitChanges: function(e) {
        var elem = e.target;
        if (this.ifEditable(elem)) {
            elem.setAttribute('readonly', true);
            axios.post('/music', {
                headers: {'X-Requested-With': 'XMLHttpRequest'},
                [elem.name]: elem.value,
                id: elem.dataset.docId
            });
        };
    },
    delete: function(youtubeID) {
        axios.delete('/music', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            data: { youtube_id: youtubeID }
        })
        .then((res) => {
            if (res.status == 200) { document.getElementById('current').remove(); }
        });
    },
    hotKeysControls: function(e) {
        if (e.metaKey && e.key == 'Enter') {
            Howler.unload();
            this.song = this.howler();
            this.song.play();
        };
        if (e.ctrlKey && e.key == 'p') {
            this.song.playing() ? this.song.pause() : this.song.play();
        };
        if (e.ctrlKey && e.key == 'Backspace') {
            this.delete(this.howl.id);
        }
    },
    howler: function() {
        return new Howl({ src: [this.howl.path] });
    },
    ifEditable: function(elem) {
        if (elem.className.includes('editable')) { return true; }
    },
    hightlightSong: function(elem) {
        var current = document.getElementById('current');
        if (current) { current.removeAttribute('id'); }
        elem.setAttribute('id', 'current');
    },
    setCurrentSong: function(elem) {
        this.howl.id = elem.dataset.docId;
        this.howl.displayTitle = elem.dataset.displayTitle;
        this.howl.path = elem.dataset.path;
    }
};
