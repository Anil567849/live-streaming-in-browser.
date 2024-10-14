import express from 'express';
import http from 'http';
const app = express();
import { Server } from 'socket.io';
import { initFfmpegProcess } from './lib/ffmpeg/index.js';
const PORT = 9000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const ffmpegProcess = initFfmpegProcess();

io.on("connection", (socket) => {
    console.log('socket connected', socket.id);

    socket.on("binarystream", (stream) => {
        console.log('Stream incomming in binary format...');
        ffmpegProcess.stdin.write(stream, (err) => {
            console.log('Err', err)
        })
    })
})

server.listen(PORT, () => console.log('server listening:', PORT));