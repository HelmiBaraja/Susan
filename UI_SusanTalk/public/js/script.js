'use strict';

const socket = io();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
        

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
        var getMessageText, message_side, sendMessage, getBotMessage, botTalk;
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
        
        botTalk = function (text) {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = text;
            synth.speak(utterance);
        };
        
        socket.emit('bypasslogin');
        
        $('.send_message').click(function (e) {
            recognition.start();
        });

        recognition.addEventListener('speechstart', () => {
            console.log('Speech has been detected.');
        });
        
        recognition.addEventListener('result', (e) => {
            console.log('Result has been detected.');

            let last = e.results.length - 1;
            let text = e.results[last][0].transcript;

            console.log('Confidence: ' + e.results[0][0].confidence);

            socket.emit('chat message', text);
            return sendMessage(text);
        });
        
        recognition.addEventListener('speechend', () => {
            recognition.stop();
        });

        recognition.addEventListener('error', (e) => {
            console.log('Error', e.error);
        });
        
        socket.on('bot reply', function(replyText) {
            botTalk(replyText["text"]);
            
            if(replyText["text"] == '') {
                replyText = '(No answer...)';
            } else {
                console.log("Account No", replyText["responseAPI"].result.parameters.accountno);
                console.log("Password", replyText["responseAPI"].result.parameters.pwd);
                getBotMessage(replyText["text"]);
            }
        });
        
        socket.on('bypass', function (isLogin) {
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
                getBotMessage('Welcome dear, You can ask me about your balance, transaction history, fund transfer, and current rate');
            }, 7000);
        })
    });
}.call(this));


        
            
    