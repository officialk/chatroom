/*
                SERVER JS
*/

const socket = require('socket.io')(8000);

var messages = [],
    users = [],
    clients = [];

socket.on("connection", client => {
    if (clients.indexOf(client.conn.remoteAddress) == -1) {
        console.log("Client Connected");

        clients.push(client.conn.remoteAddress);

        client.emit("rejected", false);

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
        client.on("typing", data => {
            client.broadcast.emit("typing", data);
        });
        client.on("message", data => {
            messages.push(data);
            client.broadcast.emit("message", data);
        });
        client.on("disconnecting", data => {
            client.broadcast.emit("userLeft", client.id);
        });
        client.on("disconnect", data => {
            users.forEach((user, id) => {
                if (user.id == client.id) {
                    clients.splice(clients.indexOf(client.conn.remoteAddress), 1);
                    users.splice(id, 1);
                }
            });
        });
    } else {
        client.emit("rejected", true);
    }
});
console.log("Started Server");
