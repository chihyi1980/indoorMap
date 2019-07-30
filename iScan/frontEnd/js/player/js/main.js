$(function(){
    var log = function (log) {
        $('#camera-msg').html(log);
        console.log(log);
    };
    var iCode;

    var onMessage = function (msg, param) {
        console.log(">> " + msg + "  " + param);
        if (msg == "STATE_LOGIN") {
            log("login");
        }
        else if (msg == "STATE_LOGOUT") {
            log("logout");
        }
        else if (msg == "STATE_ERROR") {
            if (param == "ERROR_TYPE_AUTHORIZATION") {
                log("Invalid username or password");
            }
            else if (param == "ERROR_TYPE_SOCKET") {
                log("Can not connect to server");
            }

        }
        else if (msg == "PLAY_START") {
            log("video playing");
        }
        else if (msg == "PLAY_STOPED") {
            log("video stoped");
            log('');
            login();
        }
        else if(msg == "ICODE")
        {
            iCode = param;
            snapshot();
        }
    };

    var login = function(){
        jsplayer.login(document.getElementById("videoPlayer"), '2310000082', '111111');
    };

    var snapshot = function()
    {
        var src = "http://121.40.195.232/a/imgcode?code=" + iCode;
        var image = new Image();
        image.src = src;
        var canvas = document.getElementById("videoPlayer");
        var ctx = canvas.getContext('2d');
        image.onload = function()
        {
            ctx.drawImage(image, 0,0, canvas.offsetWidth,  canvas.height - 10);
        }
    }

    $('#gmega-play').click(function(e){
        jsplayer.play();
    });
    $('#gmega-pause').click(function(){
        jsplayer.stop();
    });

    jsplayer.msgHandle = onMessage;
    login();
});

