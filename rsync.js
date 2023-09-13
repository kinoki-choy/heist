const readline = require('readline')
    , child = require('child_process');

module.exports = {
    adbConnectShell: function() {
        return child.spawn('./bin/./adb shell id', { shell: true });
    },
    startRsyncDaemon: function() {
        let cmd = "./bin/./adb shell '/data/local/tmp/rsync --daemon --config=/sdcard/rsyncd.conf --log-file=/data/local/tmp/foo &'";
        child.spawn(cmd, { shell: true });
    },
    portForwarding: function() {
        let cmd = "./bin/./adb forward tcp:6010 tcp:1873";
        child.spawn(cmd, { shell: true });
    },
    toAndroid: function() {
        this.startRsyncDaemon();
        this.portForwarding();
        var cmd = 'rsync -av --human-readable ./tmp/Heist rsync://localhost:6010/root/sdcard';
        return child.spawn(cmd, { shell: true });
    }
}
