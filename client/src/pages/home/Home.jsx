import React, { useState } from 'react';
import Form from './_components/Form'
import Video from './_components/Video'

function Home() {
    const [streamKey, setStreamKey] = useState('');
    const [streamKeyExist, setStreamKeyExist] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8000/api/yt-stream-key', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'  // Set the Content-Type header
            },
            body: JSON.stringify({key: streamKey})
        })
        const {data} = await res.json();
    
        if(data == 'ok'){
            setStreamKeyExist(true);
        }
    };

    if(!streamKeyExist){
        return (
            <Form handleSubmit={handleSubmit} streamKey={streamKey} setStreamKey={setStreamKey} />
        );
    }
    
    return (
        <Video />
    )

}

export default Home;
