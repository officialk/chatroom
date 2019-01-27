const socket = require("socket.io");


const WebSocketServer = require("ws").Server;
const webSocket = new WebSocketServer({
    port: 9969
});
console.log("Started Server");

var messages = [];

var users = [];

webSocket.on("connection", (wsCopy) => {
    console.log("Connected Client");
    //sending client previous messages
    messages.forEach(mssg => {
        wsCopy.send(mssg);
    });
    //sending client users info
    users.forEach(user => {
        wsCopy.send(user);
    });
    wsCopy.on("message", msg => {
        console.log("Message");
        //sending message
        webSocket.clients.forEach(client => {
            client.send(msg);
        });
        //        filtering messages
        let mssg = JSON.parse(msg);
        switch (mssg.type) {
            case "adduser":
                users.push(msg);
                break;
            case "message":
                messages.push(msg);
        }
    });
    wsCopy.on("close", (ws) => {
        try {
            console.log("Lost Client");
            //emptying user array for fresh data
            users = [];
            webSocket.clients.forEach(client => {
                //verifying if user is there
                client.send(JSON.stringify({
                    type: "request"
                }));
            });
        } catch (e) {
            console.log(e);
        }
    });
});
