/*
                SERVER JS
*/

const socket = require('socket.io')(8000);

var messages = [],
    users = [];

socket.on("connection", client => {
    console.log("Client Connected");
    users.forEach(user => {
        client.emit("userJoined", user);
    })
    messages.forEach(message => {
        client.emit("message", message);
    })
    client.on("addUser", data => {
        client.broadcast.emit("userJoined", data);
        users.push(data);
    });
    //    client.on("typing", data => {
    //        client.broadcast.emit("typing", data);
    //    });
    client.on("message", data => {
        messages.push(data);
        client.broadcast.emit("message", data);
    });
    client.on("disconnecting", data => {
        client.broadcast.emit("userLeft", client.id);
        users.forEach((user, id) => {
            if (user.id == client.id) {
                users = users.splice(id, 1);
            }
        });
        console.log(users);
    });
});
console.log("Started Server");
