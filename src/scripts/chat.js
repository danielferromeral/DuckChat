var solid = require('./solid.js');

class message {
    constructor(text, date, you) {
        this.text = text;
        this.date = date;
        if(you)
            this.component = "<div class=\"containerChatYou\"><p id=\"noMarginMessge\">" + text + "</p><p id=\"username\">" + (date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()) + "</p></div>"
        else
            this.component = "<div class=\"containerChatOther\"><p id=\"noMarginMessge\">" + text + "</p><p id=\"username\">" + (date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()) + "</p></div>"
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

    if (userMessages==null||userMessages=='')
        userMessages = "[]";
    if (receiveMessages==null||receiveMessages=='')
        receiveMessages = "[]";

    var userParsed = JSON.parse(userMessages);
    var receiveParsed = JSON.parse(receiveMessages);

    var allParsed = [];
    var date;
    var dateText;

    if (userParsed) {
        userParsed.forEach(element => {
            date = new Date(Number(element.date));
            allParsed.push(new message(element.text, date,true));
        });
    }
    if (receiveParsed) {
        receiveParsed.forEach(element => {
            date = new Date(Number(element.date));
            allParsed.push(new message(element.text, date,false));
        });
    }

    allParsed.sort(function(a, b) {
        return a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
    });

    var messages = [];

    allParsed.forEach((msg) => {
        messages.push(msg.component)
    });

    return messages;
}

module.exports = {
    DATA: DATA,
    FRIENDS: FRIENDS,
    addFriend: addFriend,
    listFriends: listFriends,
    sendMessage: sendMessage,
    receiveMessages: receiveMessages,
    setUpFolder: setUpFolder
}
