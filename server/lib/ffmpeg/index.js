import { spawn } from 'child_process'

const BASE_URL_YT = "rtmp://a.rtmp.youtube.com/live2";
const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `${BASE_URL_YT}/${process.env.STREAM_KEY_YT}`,
];

export function initFfmpegProcess(){
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
    
    return ffmpegProcess;
}