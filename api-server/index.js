import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 8000;
// import {spinContainer} from './aws/aws'

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}))

app.post("/api/yt-stream-key", async (req, res) => {
    const { key } = req.body;

    // store key in the database 

    // spin a container
    // await spinContainer(key);

    return res.status(200).json({ data: 'ok' });
})

app.listen(PORT, () => console.log('listening on port', PORT))