var solid = require('./solid.js');

class message {
    constructor(text, date) {
        this.text = text;
        this.date = date;
    }
}

var DATA = {
    user: "",
    userName: "",
    userURI: "",
    receiverName: "",
    receiverURI: ""
}

var FRIENDS = {
    friends: []
}

var MESSAGES = {
    userMSG: [],
    friendMSG: [],
    toShow: []
}

async function setUpFolder() {

    var folder = DATA.userURI + "public/DuckChat/";
    var err = await solid.readFolder(folder);

    if (err == null)
        await solid.createFolder(folder);

}

async function addFriend(uri) {

    var list=[];
    var userFriends = DATA.userURI + "private/DuckChatFriends.json";
    var friends = await solid.readFile(userFriends);

    if(friends!=""&&friends!=null)
        list=JSON.parse(friends);
    else
        list=[]

    list.push(uri);
    jsonString = JSON.stringify(list);

    await solid.writeJson(userFriends, jsonString);
}

async function listFriends() {

    var userFriends = DATA.userURI + "private/DuckChatFriends.json";

    return await solid.readFile(userFriends).then(body=>{
        if(body!="")
            FRIENDS.friends=JSON.parse(body);
        else
            FRIENDS.friends=[]
        return FRIENDS.friends;
    });
}

async function sendMessage(text) {

    var file = DATA.userURI + "public/DuckChat/" + DATA.receiverName.replace(/ /g, "-") + "chat.json";
    var date = new Date().getTime();
    var msg = await solid.readFile(file);

    await solid.deleteFile(file);

    var chat=[];

    if(msg!=null&&msg!='')
        chat = JSON.parse(msg);

    var message = {
        "date": date,
        "text": text
    };

    chat.push(message);
    msgJSON = JSON.stringify(chat);

    await solid.writeJson(file, msgJSON);
}

async function receiveMessages() {

    var list = [];

    var userFile = DATA.userURI + "public/DuckChat/" + DATA.receiverName.trim().replace(/ /g, "-") + "chat.json";
    var receiveFile = DATA.receiverURI + "/public/DuckChat/" + DATA.userName.trim().replace(/ /g, "-") + "chat.json";

    var userMessages = await solid.readFile(userFile);
    var receiveMessages = await solid.readFile(receiveFile);

    if (!userMessages)
        userMessages = "[]";
    if (!receiveMessages)
        receiveMessages = "[]";

    var userParsed = JSON.parse(userMessages);
    var receiveParsed = JSON.parse(receiveMessages);

    var allParsed = [];
    var date;
    var dateText;

    if (userParsed) {
        userParsed.forEach(element => {
            date = new Date(Number(element.date));
            dateText = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            allParsed.push(new message("<div class=\"containerChatYou\"><p id=\"noMarginMessge\">" + element.text + "</p><p id=\"username\">" + dateText + "</p></div>", date));
        });
    }
    if (receiveParsed) {
        receiveParsed.forEach(element => {
            date = new Date(Number(element.date));
            dateText = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            allParsed.push(new message("<div class=\"containerChatOther\"><p id=\"noMarginMessge\">" + element.text + "</p><p id=\"username\">" + dateText + "</p></div>", date));
        });
    }

    allParsed.sort(function(a, b) {
        return a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
    });

    MESSAGES.toShow = [];

    allParsed.forEach((n) => {
        MESSAGES.toShow.push(n.text)
    });

    return MESSAGES.toShow;
}

module.exports = {
    sendMessage: sendMessage,
    receiveMessages: receiveMessages,
    DATA: DATA,
    MESSAGES: MESSAGES,
    FRIENDS: FRIENDS,
    addFriend: addFriend,
    listFriends: listFriends,
    setUpFolder: setUpFolder
}
