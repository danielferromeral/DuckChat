var chat = require('./chat.js');
var login = require('./login.js');
var solid = require('./solid.js');

var $ = require('../lib/jquery.js');

$("#logout-btn").click(() => login.logout());

$("#idp-login-btn").click(function () {
	login.login();
	chat.setUpFolder();
	}
);

$("#solid-login-btn").click(function () {
		login.loginS();
		chat.setUpFolder();
	}
);

if(solid.getSession()!=null&&solid.getSession()!=""){
	solid.getSession().then(session => {
		loadProfile(session.webId);
		chat.setUpFolder();
		showFriends();
	});
}

$("#add-friend-btn").click(async function() {
	var newFriend = $("#new-friend-input").val();
	if (!(newFriend.trim().length === 0)) {
		await chat.addFriend(newFriend);
		showFriends();
		$('#new-friend-input').val('');
	}
});

$('#send-btn').click(async function sendFunc() {
		if (document.getElementById("friends").value != "") {
			var msg = $('#message-input').val();
			if (!(msg.trim().length === 0)) {
				await chat.sendMessage(msg);
				$('#message-input').val('');
				updateMessages(await chat.receiveMessages());
				scrollDown();
			}
		}
});

async function showFriends(friends) {
	var friends = await chat.listFriends();
	$('#friends').empty();
	friends.forEach(async (friend) => {
      $('#friends').append(
				$('<button>').attr('type', 'button').attr('chatType', 'personal').addClass("list-group-item list-group-item-action noactive").text(friend.split(".")[0].split("//")[1]).click(
					async function () {
						chat.DATA.receiverName = friend.split(".")[0].split("//")[1];
						chat.DATA.receiverURI = friend;
						$("#friends button").removeClass("active");
						$("#friends button").addClass("noactive");
						$(this).removeClass("noactive");
						$(this).addClass("active");
						updateMessages(await chat.receiveMessages());
						scrollDown();
					}
				)
			);
			addFriendToList(friend, '#friends-to-add');
		});
}

async function loadProfile(text) {
	chat.DATA.user = text;
	chat.DATA.userURI = text.substr(0, (chat.DATA.user.length - 15));
	chat.DATA.userName = text.split(".")[0].split("//")[1];
}

function scrollDown() {
	var element = document.getElementById("scroll");
	element.scrollTop = element.scrollHeight;
}

function updateMessages(toShow) {
	var messages = "";
	$('#messages').empty();
	toShow.forEach((message) => {
		messages = messages + message;
	});
	$('#messages').append(messages);
}

function addFriendToList(friendURI, list) {
  var friendName = friendURI.split(".")[0].split("//")[1];
  $(list).append(
		$('<button>').attr('type', 'button').addClass("list-group-item list-group-item-action noactive").text(friendName).click(
			async function () {
				$("#friends-to-add button").removeClass("active");
				$("#friends-to-add button").addClass("noactive");
				$(this).removeClass("noactive");
				$(this).addClass("active");
			}
		)
	);
}

window.setInterval(async function () {
	updateMessages(await chat.receiveMessages());
	chat.setUpFolder();
}, 1000);


