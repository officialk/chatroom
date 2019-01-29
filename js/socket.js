//initializing stuff
const link = "http://192.168.2.8:8000";
var socket, id;

//start chat only if name is given
const initChat = name => {
    if (name != null || name != "" || name != " ") {
        socket = io.connect(link);
        socket.on("connect", () => {
            if (socket.connected) {
                id = socket.id;
                setName(name);
                startEvents();
                initDomEvents();
                let user = {
                    "id": id,
                    "name": name,
                    "color": currentColor
                };
                addUser(user);
                emit("addUser", user);
                $("#getName").modal("close");
            } else {
                alert("connection failed");
            }
        });
    } else {
        alert("Enter Name");
    }
}

const startEvents = () => {
    socket.on("userJoined", user => {
        console.log(user);
        addUser(user);
    });
    //    socket.on("typing", user => {
    //        userTyping(user);
    //    });
    socket.on("message", mssg => {
        addMessage(mssg, "others");
    });
    socket.on("userLeft", user => {
        removeUser(user);
    });
}

const emit = (type, data) => {
    data.id = id;
    socket.emit(type, data);
}
