const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = [];

io.on('connection', function (socket) {
    console.log('A user has connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    }

    socket.on('startGame', function () {
        io.emit('startGame  ');
    })

    socket.on('piecePlayed', function(gameObject, isPlayerA, dropZone) {
        console.log(dropZone);
        io.emit('piecePlayed', gameObject, isPlayerA, dropZone);
    })

    socket.on('disconnect', function() {
        console.log('A user has disconnected: ' + socket.id)
        players = players.filter(player => player !== socket.id);
    })
})

http.listen(3000, function() {
    console.log('Server started!')
})