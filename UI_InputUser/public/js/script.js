'use strict';

const socket = io();

(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage, getBotMessage;
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            message_side = 'right';
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');

            message = new Message({
                text: text,
                message_side: message_side
            });

            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };

        getBotMessage = function (text) {
            message_side = 'left';
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');

            message = new Message({
                text: text,
                message_side: message_side
            });

            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };

        setTimeout(function () {
            getBotMessage('Waking Up...');
        }, 0);
        setTimeout(function () {
            getBotMessage('Hi, my name is Susan. Could you wait please dear, let me put some makeup :)');
        }, 3000);
        setTimeout(function () {
            getBotMessage('.');
        }, 4000);
        setTimeout(function () {
            getBotMessage('..');
        }, 5000);
        setTimeout(function () {
            getBotMessage('...');
        }, 6000);
        setTimeout(function () {
            getBotMessage('For now, you have to login first. Please type your username');
        }, 7000);

        $('.send_message').click(function (e) {
            socket.emit('chat message', getMessageText());
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                socket.emit('chat message', getMessageText());
                return sendMessage(getMessageText());
            }
        });

        socket.on('bot reply', function (replyText) {
            if (replyText == '') {
                replyText = '(No answer...)';
            } else {
                console.log("Bot Reply", replyText);
                getBotMessage(replyText["text"]);
            }
        });
    });
}.call(this));
