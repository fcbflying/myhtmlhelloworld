/*
* @Author: jack.lu
* @Date: 2020/5/28
* @Last Modified by: jack.lu
* @Last Modified time: 2020/5/28 2:36 下午
*/

(function () {


    var goeasy = null,
        messages = [],
        $messageBox = document.getElementById('messageBox'),
        $messageContent = document.getElementById('messageContent'),
        $sendBtn = document.getElementById('sendBtn');


        var initGoEasy = function() {
        goeasy = GoEasy({
            host: 'hangzhou.goeasy.io',
            appkey: "您的appkey",
            onConnected: function () {
                console.log("GoEasy connect successfully.");
            },
            onDisconnected: function () {
                console.log("GoEasy disconnected.");
            },
            onConnectFailed: function (error) {
                console.log("连接失败，请检查您的appkey和host配置")
            }
        });
        subscribeMessage();
    };

    var subscribeMessage = function () {
        goeasy.subscribe({
            channel: "html_hello_world_channel",
            onMessage: function (message) {
                unshiftMessage(message.content);
            },
            onSuccess: function () {
                unshiftMessage('订阅成功.');
            }
        });
    };

    var unshiftMessage = function (content) {
        let formattedTime = new Date().formatDate("hh:mm");
        let message = formattedTime + " " + content;
        messages.unshift(message);
        mountTemplate();
    };

    var sendMessage = function () {
        if ($messageBox.value.trim() != '') {
            goeasy.publish({
                channel: "html_hello_world_channel",
                message: $messageBox.value,
                onSuccess: function () {
                    console.log("send message success");
                    $messageBox.value = "";
                },
                onFailed: function (error) {
                    unshiftMessage('发送失败，请检查您的appkey和host配置.');
                }
            });
        }
    };


    var mountTemplate = function () {
        var $innerHTML = buildTemplate();
        $messageContent.innerHTML = $innerHTML;
    };

    var buildTemplate = function () {
        var str = "";
        for(var i=0; i< messages.length; i++) {
            str +='<div class="message-text" >'
                + messages[i]
                +'</div>'
        }
        return str;
    };

    var addEventListenerOptions = function () {
        $sendBtn.onclick = function (e) {
            sendMessage()
        };
    };

    Date.prototype.formatDate = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if(o.hasOwnProperty(k)){
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        return fmt;
    };

    initGoEasy();
    addEventListenerOptions();

})();