const express = require('express');
const { getTopUsers, getPostsByType } = require('./utils/datautils');

const app = express();
const PORT = 3000;

app.get('/users', async (req, res) => {
    try {
        const result = await getTopUsers();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/posts', async (req, res) => {
    const type = req.query.type;
    if (!['latest', 'popular'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
    try {
        const result = await getPostsByType(type);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});