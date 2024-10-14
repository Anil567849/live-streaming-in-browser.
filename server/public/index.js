const video = document.getElementById("user-video");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const mainContainer = document.getElementById("start-container");
const videoContainer = document.getElementById("video-container");
const streamKeyInput = document.getElementById("stream-key-input");
const streamKeyButton = document.getElementById("stream-key-btn");

const state = {
    mediaStream: null,
    mediaRecorder: null,
}

const socket = io();

async function getMediaStream(){
    state.mediaStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    video.srcObject = state.mediaStream;
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

window.addEventListener("load", async (e) => {
    videoContainer.style.display = 'none';
})

streamKeyButton.addEventListener('click', async () => {
    const key = streamKeyInput.value;
    console.log(key);
    
    const res = await fetch('http://localhost:3000/api/yt-stream-key', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'  // Set the Content-Type header
        },
        body: JSON.stringify({key: key})
    })
    const {data} = await res.json();

    if(data == 'ok'){
        getMediaStream();
        mainContainer.style.display = 'none';
        videoContainer.style.display = 'block';
    }
})

startBtn.addEventListener("click", async () => {
    if(!state.mediaStream){
        await getMediaStream();
    }
    
    startBtn.disabled = true;
    stopBtn.disabled = false;

    // Set up MediaRecorder to capture media stream
    state.mediaRecorder = new MediaRecorder(state.mediaStream, {
        // mimeType: 'video/webm; codecs=vp8,opus' // Common format for WebRTC and YouTube
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        framerate: 25,
    });

    // When data is available, send it to the server
    state.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket && socket.connected) {
            socket.emit("binarystream", event.data); // Send the Blob containing video/audio data
        }
    };

    if (state.mediaRecorder && state.mediaRecorder.state === "inactive") {
        state.mediaRecorder.start(25); // Start recording, sending chunks every 25ms
    }
});

// Stop streaming video
stopBtn.addEventListener("click", () => {
    state.mediaRecorder.stop();
    const tracks = state.mediaStream.getTracks();
    tracks.forEach(track => track.stop());
    state.mediaStream = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;
});