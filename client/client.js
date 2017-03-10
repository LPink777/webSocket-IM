$(function() {
	var username = null,
		userid = null;
	var socket = null;
	var obj = {};

	$('.loginBtn').click(function() {
		$('.loginView').css('display', 'none');
		$('.container').css('display', 'block');
		username = $('.username').val()
		$('.usname').html("User : "+username)
		init(username,obj)
		$('.username').val('');
	});

	$('.logoutBtn').click(function() {
		$('.container').css('display', 'none');
		$('.loginView').css('display', 'block');
		location.reload();
	});

	$('.enterMs').click(function() {
		var user = {};
		if ($('.content').val() != '') {
			obj.content = $('.content').val();
			socket.emit('message',obj)
			$('.content').val('')
		}
	});

	$(document).keydown(function(e){
		if(e.keyCode==13){
			if ($(".loginView").css("display")=="none") {
				$('.enterMs').click();
			}else{
				$('.loginBtn').click();
			}
		}
	});

	function Gui() {
		return new Date().getTime() + '' + Math.floor(Math.random() * 899 + 100);
	}

	function init(username,obj) {
		obj.username = username;
		obj.userid = Gui();
		userid = Gui();
		console.log(obj)

		socket = io.connect('http://localhost:5200/');

		socket.emit("login",obj)
		socket.on('login', function(o) {
            updateSysMsg(o, 'login');
            if ($('.messages').height() < $('.messages')[0].scrollHeight) {
				$('.messages').scrollTop($('.messages')[0].scrollHeight);
			}
        });

        socket.on('logout', function(o) {
            updateSysMsg(o, 'logout');
            if ($('.messages').height() < $('.messages')[0].scrollHeight) {
				$('.messages').scrollTop($('.messages')[0].scrollHeight);
			}
        });

        socket.on('message',function(objUser) {
        	console.log(objUser)
        	var color = ["red","orange","yellow","olive","green","teal","blue","violet","purple","pink","brown","black"];
        	var numColor = Math.round(Math.random()*11)
        	if (objUser.userid == obj.userid) {
	        	$section = $('<div style="width:100%;float:left;clear:both;"><div class="headerclass"></div><div class="ui mini '+color[numColor]+' message messagediv" style="font-size:14px;padding:5px 15px;"></div></div>')
				$section.find('.messagediv').html(objUser.content)
				$section.find('.headerclass').html(objUser.username)
	        	$('.messages').append($section);
        	}else{
        		$section = $('<div style="width:100%;float:left;clear:both;"><div class="headerclass1"></div><div class="ui mini '+color[numColor]+' message messagediv1" style="font-size:14px;padding:5px 15px;"></div></div>')
				$section.find('.messagediv1').html(objUser.content)
				$section.find('.headerclass1').html(objUser.username)
	        	$('.messages').append($section);
        	}
        	if ($('.messages').height() < $('.messages')[0].scrollHeight) {
				$('.messages').scrollTop($('.messages')[0].scrollHeight);
			}
        })
	}

	function updateSysMsg(o,action) {
		console.log(o)
		var userhtml = '';
        var separator = '';
		var onlineUsers = o.onlineUsers;
		for (key in onlineUsers) {
            if (onlineUsers.hasOwnProperty(key)) {
                userhtml += separator + onlineUsers[key];
                separator = '、';
            }
        }
		$('.onlineuser').html('当前共有'+o.onlineCount+'人在线,在线列表 : '+userhtml)
		$section = $('<section class="section"></section>')
		var html = '';
		html += o.user.username + ((action=='login')?'加入了房间':'退出了房间');
		$section.html(html)
		$('.messages').append($section);
	}
})