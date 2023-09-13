const Modal = {
    init: function() {
        this.cacheDOM();
        this.bindEvents();
    },
    cacheDOM: function() {
        this.resultsContainer = document.querySelector('.results');
        this.modal = document.querySelector('.modal');
        this.modal_close = document.querySelector('.modal-close');
        this.modal_background = document.querySelector('.modal-background');
        this.iframe = document.getElementById('video');
    },
    bindEvents: function() {
        this.resultsContainer.addEventListener('click', this.launchModal.bind(this), false);
        this.modal_close.addEventListener('click', this.closeModal.bind(this));
        this.modal_background.addEventListener('click', this.closeModal.bind(this));
        window.addEventListener('keydown', this.hotKeysControls.bind(this));
    },
    launchModal: function(e) {
        e.preventDefault();
        if (e.target.parentNode.className.includes('with-modal')) {
            this.iframe.src = `https://www.youtube.com/embed/${e.target.parentNode.dataset.youtubeId}`;
            this.modal.classList.add('is-active');
        };
    },
    closeModal: function() {
        this.iframe.src = '';
        this.modal.classList.remove('is-active');
    },
    hotKeysControls: function(e) {
        if (e.key == 'Escape') { this.closeModal(); }
    }
}
