process.on('uncaughtException', (error) => {
    console.log('Alert! ERROR : ', error);
    process.exit(1);
})

require("dotenv").config();
require("./config/db").connect();

const express = require("express");
var morgan = require('morgan');
const cors = require("cors");
const app = express();

const mainRouters = require('./routes')

app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '25mb' }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.status(200).json({ message: "success" });
})

mainRouters(app);

module.exports = (req, res) => {
    app(req, res);
};

// app.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`);
// })