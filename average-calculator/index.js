const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

const WINDOW_SIZE = 10;
let window = [];

const NUMBER_TYPES = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand'
};

const BASE_URL = 'http://20.244.56.144/evaluation-service/';

const AUTH_TOKEN = process.env.AUTH_TOKEN;

async function fetchNumbers(type) {
    try {
        const response = await axios.get(`http://20.244.56.144/evaluation-service/${type}`, {
            timeout: 500,
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`
            }
        });
        return response.data.numbers || [];
    } catch (error) {
        console.error("Fetch error:", error.message);
        return [];
    }
}

app.get('/numbers/:numberid', async (req, res) => {
    const id = req.params.numberid;

    if (!NUMBER_TYPES[id]) {
        return res.status(400).json({ error: "Invalid number ID" });
    }

    const type = NUMBER_TYPES[id];
    const prevState = [...window];
    const fetched = await fetchNumbers(type);

    console.log("Fetched:", fetched);

    let newNumbers = [];

    for (let num of fetched) {
        if (!window.includes(num)) {
            if (window.length >= WINDOW_SIZE) {
                window.shift();
            }
            window.push(num);
            newNumbers.push(num);
        }
    }

    const avg = window.length
        ? parseFloat((window.reduce((a, b) => a + b, 0) / window.length).toFixed(2))
        : 0;

    res.json({
        windowPrevState: prevState,
        windowCurrState: [...window],
        numbers: newNumbers,
        avg: avg
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});