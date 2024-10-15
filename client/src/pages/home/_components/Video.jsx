import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const URL = 'http://localhost:9000'; // server

export const socket = io(URL);

function LiveStream() {
    const videoRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    useEffect(() => {
        if(!mediaRecorder) return;
        // When data is available, send it to the server
        console.log(socket);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && socket && socket.connected) {
                socket.emit("binarystream", event.data); // Send the Blob containing video/audio data
                console.log("binarystream", event.data); // Send the Blob containing video/audio data
            }
        };

        if (mediaRecorder && mediaRecorder.state === "inactive") {
            mediaRecorder.start(25); // Start recording, sending chunks every 25ms
        }
    }, [mediaRecorder])


    useEffect(() => {
        if (!streaming) {
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
            return;
        }
        // Set up MediaRecorder to capture media stream
        setMediaRecorder(new MediaRecorder(mediaStream, {
            // mimeType: 'video/webm; codecs=vp8,opus' // Common format for WebRTC and YouTube
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            framerate: 25,
        }));


    }, [streaming])

    // Start streaming video
    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            videoRef.current.srcObject = stream;
            setMediaStream(stream);
            setStreaming(true);
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    };

    // Stop streaming video
    const stopStream = () => {
        mediaStream.getTracks().forEach(track => track.stop()); // Stops the media stream
        videoRef.current.srcObject = null;
        setStreaming(false);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Live Stream</h1>
            <video ref={videoRef} autoPlay style={styles.video} />
            <div style={styles.buttonContainer}>
                <button
                    onClick={startStream}
                    style={styles.button}
                    disabled={streaming}  // Disable start button if already streaming
                >
                    Start
                </button>
                <button
                    onClick={stopStream}
                    style={styles.button}
                    disabled={!streaming} // Disable stop button if not streaming
                >
                    Stop
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f9',
    },
    heading: {
        marginBottom: '20px',
        fontSize: '32px',
        color: '#333',
    },
    video: {
        width: '600px',
        height: '400px',
        marginBottom: '20px',
        borderRadius: '8px',
        backgroundColor: '#000',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    }
};

export default LiveStream;
