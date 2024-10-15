import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 8000;
// import {spinContainer} from './aws/aws'
import { saveToDB } from './lib/db/index.js';

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}))

app.post("/api/yt-stream-key", async (req, res) => {
    const { key } = req.body;
    try {
        await saveToDB(key);

        // await spinContainer(key);

        return res.status(200).json({ data: 'ok' });
    } catch (error) {
        if (error.code === 'P2002') {
            // Prisma's unique constraint violation error
            return res.status(200).json({ data: 'ok' });
          } else {
            console.log('Error:', error)
            return res.status(500).json({ data: 'not ok' });
          }
        
        
    }

})

app.listen(PORT, () => console.log('listening on port', PORT))