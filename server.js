const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (local or Atlas via MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/highscores', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// POST: Add a score
app.post('/api/scores', async (req, res) => {
    try {
        const { name, score } = req.body;
        const newScore = new Score({ name, score });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// GET: Get top 10 scores
app.get('/api/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

// DELETE: Clear all scores
app.delete('/api/scores', async (req, res) => {
    try {
        await Score.deleteMany({});
        res.json({ message: 'All scores deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete scores' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
