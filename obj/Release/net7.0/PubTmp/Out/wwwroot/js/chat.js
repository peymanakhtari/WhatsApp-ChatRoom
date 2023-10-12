"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/Chat").build();

connection.start().then(function () {
    console.log('connection started');
}).catch(function (err) {
    return console.error(err.toString());
});
connection.on("NewUserJoined", (name, date, time) => {
    $('.chatBoxes').append(userJoin(name, date, time));
    scrollChatBoxToBottom();
});
connection.on("ReceiveMessage", (username, name, message, date, time) => {
    var state = _username === username ? 'send' : 'recive';
    $('.chatBoxes').append(TextRecive(state
        , name, message, date, time));
    scrollChatBoxToBottom();
});

connection.on("ReceiveAudio", (username, name, date, time, audioPath) => {
    var state = _username === username ? 'send' : 'recive';
    $('.chatBoxes').append(AudioReceiveComplete(state, name, audioPath, date, time));
    scrollChatBoxToBottom();
});
connection.on("ReceiveImage", (username, name, date, time, image, id) => {
    var state = _username === username ? 'send' : 'recive';
    $('.chatBoxes').append(imageReceive(state, name, image, date, time, id));
    var $imageElement = $(`#${id}`);

    // Attach an onload event handler to the image element
    $imageElement.on('load', function () {
        scrollChatBoxToBottom();
    });
});
$('#txtMessage').keyup(function (event) {
    if ($(this).val().trim().length > 0) {
        $('#sendText').css('display', 'flex')
    }
    else {
        $('#sendText').css('display', 'none')
    }
});

$('#sendText').click(function () {
    var inputMessage = $('#txtMessage');
    if (inputMessage.val().length !== 0) {
        var message = inputMessage.val();
        connection.invoke("SendMessage", _username, _name, message).catch(function (err) {
            return console.error(err.toString());
        });
        inputMessage.val('');
        $(this).css('display', 'none');
    }
})

function joinChatRoom() {
    //first validate the input
    if ($('#user_name').val().length == 0) {
        $('#usernameValidation').removeClass('hidden');
        return
    }
    // add cookie and connect to server hub
    setCookie().then(function (val) {
        //set the values of cookie to hmtl inputs and variables
        _username = val.split(',')[1];
        _name = val.split(',')[0];
        $('#name').val(_name);
        $('#username').val(_username);

        removeJoinComponents();
        connection.invoke("joinChatRoom", val).catch(function (err) {
            return console.error(err.toString());
        });
    }).catch(function (err) {
        console.log(err.toString());
    });
}

function removeJoinComponents() {
    $('.chatBoxes').removeClass('blur-sm');
    $('#startArea').addClass('hidden');
}

function setCookie(name) {
    var name = $('#user_name').val();
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "post",
            url: "/Home/SetCookie",
            data: { name: name },
            success: function (response) {
                resolve(response);
            }, error: function (error) {
                reject(error);
            }
        });
    });
}


$(document).ready(function () {

    //record code:
    let count = 0;
    let intervalId = null;
    let mediaRecorder;
    let audioChunks = [];

    function handleDataAvailable(event) {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    }

    function updateCounter() {
        $("#counter").text(count);
        setTimeout(() => {
            $(".microIcon").css('opacity', 1);
            setTimeout(() => {
                $(".microIcon").css('opacity', 0);
            }, 500);
        }, 1000);
        count++;
    }

    function stopRecord() {
        $("#counter").text(0);
        clearInterval(intervalId);
    }

    function toggleRecord() {
        $('#microIcon').toggleClass('hidden')
        $('#sendIcon').toggleClass('hidden')
        $('#recordEdit').toggleClass('h-32')
    }

    $('#btnDeleteVoice').click(function (e) {
        e.preventDefault();
        toggleRecord();
        stopRecord();

    });

    $('#sendVoice').click(async function (e) {
        e.preventDefault();
        if ($('#recordEdit').hasClass('h-32')) {
            // stop record and send voice
            mediaRecorder.stop();

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioChunks = [];

                const formData = new FormData();
                var fileName = '_recording.wav'
                formData.append('audio', audioBlob, fileName);
                toggleRecord();
                stopRecord();

                const uniqueString = generateRandomString();
                const audioPath = `${uniqueString}${fileName}`;
                // append Audio loader to chat box
                $('.chatBoxes').append(Uploading(_name));
                scrollChatBoxToBottom();

                fetch(`/Home/UploadAudio/${uniqueString}`, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (response.ok) {
                            $(`#${_username}`).remove();
                            connection.invoke("SendAudio", _name, _username, audioPath).catch(function (err) {
                                return console.error(err.toString());
                            });;

                            console.log('Audio uploaded successfully');

                        } else {
                            console.error('Error uploading audio');
                        }
                    })
                    .catch(error => {
                        // Handle network or other errors
                        console.error('Error:', error);
                    });


            };

        }
        else {
            //start record

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = handleDataAvailable;
                audioChunks = [];

                mediaRecorder.start();

                toggleRecord();
                count = 0; // Reset the count to 0
                $("#counter").text(count); // Update the counter element
                updateCounter(); // Call it once to start blinking immediately
                intervalId = setInterval(updateCounter, 1000); // Start a new interval

            } catch (error) {
                alert('Error accessing microphone: ' + error.message);
            }

        }
    })



    $('#sendImage').click(function () {
        const fileInput = document.getElementById('input-file');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];

            const formData = new FormData();
            formData.append('image', file, file.name); // 'image' is the field name for the image file
            scrollChatBoxToBottom();
            $('#imagePreview').addClass('hidden');
            $('.chatBoxes').append(Uploading(_name));
            fetch('/Home/UploadImage', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        // Handle success by parsing JSON response
                        response.json()
                            .then(data => {
                                // Access the file path from the response
                                $(`#${_username}`).remove();
                                var id = data.fileName.split('.')[0];
                                connection.invoke('SendImage', _username, _name, id, data.fileName).catch(function (err) {
                                    return console.error(err.toString());
                                });
                                // Do whatever you need to do with the file path
                            })
                            .catch(error => {
                                console.error('Error parsing JSON response:', error);
                            });
                    } else {
                        // Handle error
                        console.error('Error uploading image');
                    }
                })
                .catch(error => {
                    // Handle network or other errors
                    console.error('Error:', error);
                })
        }
    })
})

