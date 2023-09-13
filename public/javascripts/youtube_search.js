const YoutubeSearch = {
    init: function() {
        this.cacheDOM();
        this.bindEvents();
    },
    cacheDOM: function() {
        this.resultsContainer = document.querySelector('.results');
    },
    bindEvents: function() {
        this.resultsContainer.addEventListener('click', this.loadMore.bind(this), false);
    },
    render: function (data) {
        this.resultsContainer.innerHTML += data;
    },
    loadFragmentResults: function(url) {
        axios.get(url, { headers: {'X-Requested-With': 'XMLHttpRequest'} })
            .then((res) => { this.render(res.data); }
        );
    },
    requestDownload: function(youtubeID, youtubeTitle) {
        axios.post('/download', {
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            youtube_id: youtubeID,
            title: youtubeTitle
        });
    },
    loadMore: function(e) {
        if(e.target.id == 'load_more') {
            e.preventDefault();
            e.target.parentNode.removeChild(e.target);
            this.loadFragmentResults(e.target.href);
        }
    }
};
