const socket = require('socket.io')(8000);

var messages = [],
    users = [];

socket.on("connection", client => {
    console.log("Client Connected");
    client.on("message", data => {

    });
    client.on("addUser", data => {

    });
    client.on("typing", data => {

    });
    client.on("close", data => {

    });
});
console.log("Started Server");
