const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express()

const axios = require('axios');
app.use(cors());

// Define a schema for the ticker data
const tickerSchema = new mongoose.Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    base_unit: String,
})

// Define a model for the ticker data using the schema
const Ticker = mongoose.model('Ticker', tickerSchema)

axios.get('https://api.wazirx.com/api/v2/tickers')
    .then((res) => {
        const tickers = res.data;
        const top10 = Object.values(tickers).slice(0, 10)
        const tickerData = top10.map((ticker) => {
            return {
                name: ticker.name,
                last: ticker.last,
                buy: ticker.buy,
                sell: ticker.sell,
                volume: ticker.volume,
                base_unit: ticker.base_unit,
            }
        })
        console.log(tickerData)

        // Save the ticker data to MongoDB
        Ticker.insertMany(tickerData)
            .then(() => {
                console.log('Ticker data saved to MongoDB')
            })
            .catch((err) => {
                console.log(err)
            })
    })
    .catch((err) => {
        console.log(err)
    })

// API endpoint to get the ticker data from the database
app.get('/api/tickers', (req, res) => {
    Ticker.find()
        .then((tickers) => {
            res.json(tickers);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Server Error')
        });
});

mongoose.connect("mongodb+srv://Rimsha:RimAtlas@cluster0.ij9mujl.mongodb.net/coin-webpage", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.listen(3000, () => {
    console.log('Server started on port 3000');
})



