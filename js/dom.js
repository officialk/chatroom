var windowBlurred, currentColor, userName, MESSAGE_TYPE = "text",
    messageCount = 0;
//onload
window.onload = () => {
    $('.modal').modal({
        dismissible: false
    });
    setColor();
    if (window.localStorage.getItem("name") != null) {
        initChat(window.localStorage.getItem("name"));
    } else {
        $("#getName").modal("open");
    }
}

const initDomEvents = () => {
    document.getElementById("messageInput").addEventListener("keypress", key => {
        if (key.keyCode == 13) {
            sendMessage();
        }
    });
}

//socket Related
const sendMessage = () => {
    let content = document.getElementById("messageInput").value;
    if (content.length > 0 && content != "" && content != " ") {

        let message = {
            "type": MESSAGE_TYPE,
            "content": content,
            "sender": userName,
            "color": currentColor,
            "number": messageCount++
        }
        emit("message", message);
        addMessage(message, "self");
        document.getElementById("messageInput").value = "";
    }
}

const addMessage = (message, sender) => {
    var messg = document.getElementById("messages")
    messg.innerHTML += (
        `<div class='message ${sender} ${message.color}' id='${message.id}${message.number}'>
            <p class='sender'>${message.sender}</p>${message.content}
        </div`
    );
    document.getElementById("end").scrollIntoView(true);
    document.getElementById(message.id).innerHTML = message.sender[0].toUpperCase();
}

const addUser = user => {
    document.getElementById("peopleInChat").innerHTML += (`<div class='btn-floating center user ${user.color}' id='${user.id}' title='${user.name}'>${user.name[0].toUpperCase()}</div>`);
}

const removeUser = user => {
    document.getElementById("peopleInChat").removeChild(
        document.getElementById(user)
    )
}

const startTyping = () => {
    emit("typing", {
        "name": userName
    });
}

const userTyping = user => {
    document.getElementById(user.id).innerHTML = `<i class='material-icons'>more_horiz</i>`;
}
//self functions

const setName = name => {
    window.localStorage.setItem("name", name);
    userName = name;
}

const setColor = () => {
    let color;
    if (window.localStorage.getItem("color") != null) {
        color = window.localStorage.getItem("color");
    } else {
        let colorList = ["cblue", "cgreen", "cred", "cyellow", "cpink", "cblack", "cvoilet"];
        color = colorList[Math.floor(Math.random() * colorList.length)];
    }
    var elems = document.getElementsByClassName("mainColor");
    for (var i = 0; i < elems.length; i++) {
        elems[i].classList.remove(currentColor);
        elems[i].className += " " + color;
    }
    currentColor = color;
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
