(function() {

    const socket = io();
    const SocketEvents = {
        init: function() {
            this.cacheDOM();
            this.pubDownloadQue();
            this.pubDownloadProgress();
            this.pubSyncOutput();
        },
        cacheDOM: function() {
            this.heading = document.querySelector('.heading');
            this.queue = document.querySelector('.queue');
            this.sync_log = document.querySelector('.log');
        },
        pubDownloadQue: function() {
            socket.on('download_que', (data) => {
                if (Object.keys(data).length == 0) {
                    this.heading.style.display = 'none';
                } else {
                    this.heading.style.display = 'inline';
                    for (var k in data) {
                        if (!document.getElementById(`${k}`)) {
                            this.queue.innerHTML += `<li>${data[k].title}<progress class="progress is-small" id=${k} value=${data[k].sta} max='100'></progress></li>`;
                        }
                    };
                };
            });
        },
        pubDownloadProgress: function() {
            socket.on('download_progress', (data) => {
                if (data.sta == 0) {
                    document.getElementById(data.id).parentNode.remove();
                } else {
                    document.getElementById(data.id).value = data.sta;
                };
            });
        },
        pubSyncOutput: function() {
            socket.on('sync', (data) => {
                this.sync_log.innerHTML += `<p>${data}</p>`;
                window.scrollTo(0,document.body.scrollHeight);
            });
        }
    };

    SocketEvents.init();

})();
