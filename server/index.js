import express from 'express';
import http from 'http';
import path from 'path';
const app = express();
import { Server as SocketIO } from 'socket.io';
import { spawn } from 'child_process'
import { options } from './lib/ffmpeg/index.js';

const server = http.createServer(app);
const io = new SocketIO(server);

app.use(express.static(path.resolve('./public')));
app.use(express.json());

const ffmpegProcess = spawn('ffmpeg', options);

ffmpegProcess.stdout.on('data', (data) => {
    console.log(`ffmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on('data', (data) => {
    console.error(`ffmpeg stderr: ${data}`);
});

ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${code}`);
});

io.on("connection", (socket) => {
    console.log('socket connected', socket.id);

    socket.on("binarystream", (stream) => {
        console.log('Stream incomming in binary format...');
        ffmpegProcess.stdin.write(stream, (err) => {
            console.log('Err', err)
        })
    })
})


app.post("/api/yt-stream-key", (req, res) => {
    const {key} = req.body;
    return res.status(200).json({data: 'ok'});
})

server.listen(3000, () => console.log('server connected on port 3000'));