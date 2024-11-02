const express = require('express');
const app = express();
const http = require('http'); // Import http module and bind it to the express app
const { dirname } = require('path');
const socketIo = require('socket.io'); // Import socket.io module and bind it to the http server
const path = require('path'); // Import path module to set the public folder path

// Concept: Create a http server using express app and bind it to the socket.io
// This is done to enable socket.io to listen to the http server and not the express app
// This is because express app is a middleware and it does not have the capability to listen to the socket events
// Hence, we need to bind the express app to the http server and then bind the http server to the socket.io

const httpServer = http.createServer(app); // Create a http server using express app
const io = socketIo(httpServer); // Bind the http server to the socket.io

app.set('view engine', 'ejs'); // Set the view engine to ejs to render the html files
app.use(express.static(path.join(__dirname, 'public'))); // Set the public folder to serve static files

io.on('connection', (socket) => {
    console.log('A user connected');
    // Concept: Listen for the send-Location event from the client
    // The data contains the latitude and longitude of the user
    // The data is then broadcasted to all the clients including the sender
    socket.on('send-Location', (data) => {
        console.log(data);
        socket.emit('receive-Location', {id: socket.id, ...data});
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        socket.emit("user-disconnected", socket.id);
    });
});

app.get('/', (req, res) => {
    // Concept: Render the index.ejs file when the user hits the home route '/'
    // This file is present in the views folder and it is rendered using the ejs view engine
    // The ejs file contains the html code which is rendered when the user hits the home route
    res.render('index'); 
});

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});