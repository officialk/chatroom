//update with your server name
const serv = "ws://192.168.0.101:9969";

var wsock, name, color, windowBlurred = false,
    mssgCnt = 0;

$(document).ready(function () {
    $('.modal').modal({
        dismissible: false
    });
    if (window.localStorage.getItem("name") != null) {
        startSocket(window.localStorage.getItem("name"));
    } else {
        $("#getName").modal("open");
    }
});

const initChat = () => {
    var nameval = document.getElementById("nameOfPerson").value;
    if (nameval != "" && nameval != null && nameval.length > 0) {
        window.localStorage.setItem("name", nameval);
        startSocket(nameval);
        $("#getName").modal("close");
    } else {
        alert("Enter Name!!!");
    }
}

const startSocket = n => {
    console.log(n);
    name = n;
    wsock = new WebSocket(serv);
    wsock.onopen = socketopen;
    wsock.onmessage = socketmessage;
    wsock.onclose = socketclose;
    wsock.onerror = socketerror;

    document.querySelector("#messageInput")
        .addEventListener("keypress", key => {
            if (key.charCode === 13) {
                sendMssg();
            }
        });
    setColor();
}

const socketopen = socInfo => {
    let message = {
        type: "adduser",
        name: name,
        color: color
    }
    wsock.send(JSON.stringify(message));
    setTitle("Connected");
}

const socketmessage = mssg => {
    var message = JSON.parse(mssg.data);
    switch (message.type) {
        case "adduser":
            addUser(message.name, message.color);
            break;
        case "removeuser":
            removeUser(message.name);
            break;
        case "message":
            addMessage(message.data, message.from, message.color);
            break;
        case "request":
            removeAllUsers();
            sendActiveSignal();
            break;
        default:
            console.log(mssg);
            break;
    }
}

const socketclose = socInfo => {
    let message = {
        type: "removeuser",
        name: name
    }
    wsock.send(JSON.stringify(message))
}

const socketerror = socInfo => {
    let message = {
        type: "removeuser",
        name: name
    }
    wsock.send(JSON.stringify(message))
    alert("You Are Offline/Server is Down");
}

const sendMssg = () => {
    var elem = document.getElementById("messageInput")
    if (elem.value != "") {
        let message = {
            type: "message",
            data: elem.value,
            from: name,
            color: color
        }
        wsock.send(JSON.stringify(message));
        elem.value = "";
    }
}

const addUser = (user, color) => {
    let html = `<button class='btn-floating ${color}' title="${user}" id='${user}Button'>${user[0].toUpperCase()}</button>`;
    document.getElementById("peopleInChat").innerHTML += html;
    setTitle(`${user} Joined Channel`);
}

const removeUser = user => {
    document.getElementById("peopleInChat").removeChild(document.getElementById(`${user}Button`));
}

const addMessage = (message, user, color) => {
    let classToAssign = "self";
    var namePrint = "you";
    if (user != name) {
        classToAssign = "others";
        namePrint = user;
    }
    if (message.indexOf("http://") >= 0 || message.indexOf("https://") >= 0 || message.indexOf("www.") >= 0) {
        message = `<a href="${message}" target="_blank">${message}</a>`;
    }
    let html = `<div class="message ${classToAssign} ${color}">
                                <p class="sender">${namePrint}</p>${message}
                            </div>`
    document.getElementById("messages").innerHTML += html;
    document.getElementById("end").scrollIntoView(true);
    mssgCnt += 1;
    setTitle(`You Have ${mssgCnt} Messages`);
}

const sendActiveSignal = () => {
    wsock.send(JSON.stringify({
        type: "adduser",
        name: name,
        color: color
    }));
}

const removeAllUsers = () => {
    document.getElementById("peopleInChat").innerHTML = "";
}

const setColor = () => {
    let colorList = ["cblue", "cgreen", "cred", "cyellow", "cpink", "cblack", "cvoilet"];
    color = colorList[Math.round(Math.random() * (colorList.length))];
    var elems = document.getElementsByClassName("mainColor");
    for (var i = 0; i < elems.length; i++) {
        elems[i].className += " " + color;
    }
}

const setTitle = text => {
    if (windowBlurred) {
        document.title = text;
    }
}

window.onblur = e => {
    windowBlurred = true;
    mssgCnt = 0;
}

window.onfocus = e => {
    document.title = "Chatroom";
    windowBlurred = false;
    mssgCnt = 0;
}
