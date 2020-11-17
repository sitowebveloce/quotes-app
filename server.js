// Requirements
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
// App
const app = express();

// MIDDLEWARES
// Body Parser
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Set View engine
app.set('view egine', 'ejs');
// Set public folder
app.use(express.static(__dirname + '/public'));

// Routes
const index = require('./routes/index');
app.use('/', index);

// SERVER LISTENER
let PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server beating ❤️ on port ${PORT}`);
});