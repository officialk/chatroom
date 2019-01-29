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

const addMessage = (message, sender) => {
    var messg = document.getElementById("messages")
    messg.innerHTML += (
        `<div class='message ${sender} ${message.color}' id='${message.id}${message.number}'>
            <p class='sender'>${message.sender}</p>${message.content}
        </div`
    );
    document.getElementById("end").scrollIntoView(true);
}

const addUser = user => {
    document.getElementById("peopleInChat").innerHTML += (`<div class='btn-floating center ${user.color}' id='${user.id}' title='${user.id}'><b>${user.name[0].toUpperCase()}</b></div>`);
}

const removeUser = user => {
    document.getElementById("peopleInChat").removeChild(
        document.getElementById(user)
    )
}

//self functions

const setName = name => {
    window.localStorage.setItem("name", name);
    userName = name;
}

const setColor = () => {
    let colorList = ["cblue", "cgreen", "cred", "cyellow", "cpink", "cblack", "cvoilet"];
    color = colorList[Math.floor(Math.random() * colorList.length)];
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
