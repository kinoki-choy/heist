# Heist
A songs manager for personal usage. Content search and download can be done via the front-end interface.
Downloads progress are then streamed via sockets and stored locally.

### How it works
Audio files are downloaded from Youtube and converted to mp3 via FFmpeg.

### Storage
This app uses an embedded persistent storage. Refer to [NeDB](https://github.com/louischatriot/nedb).

### Synchronising to phone
Songs can be synchronised to Android phones via adb and rsync.

### Prerequisites
1. Local installation of FFmpeg must present on your system.
2. Android Debug Bridge (adb)
