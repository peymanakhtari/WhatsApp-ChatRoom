//  <reference path="../typings/tsd.d.ts" />
var _name;
var _username;
$(document).ready(function () {
    _username = $('#username').val();
    _name = $('#name').val();

    $('.chatBoxes').removeClass('hidden');
    $('#Onloadbackground').addClass('hidden');
    scrollChatBoxToBottom();

    //check if user has already joined
    if (_name.length == 0 || _username.length == 0) {
        $('.chatBoxes').addClass('blur-sm');
        $('#startArea').removeClass('hidden');
    }

    $(".usernameBox input").focus(function (e) {
        e.preventDefault();
        $(".usernameBox span").addClass("usernameInputFocus");
    });

    $(".usernameBox input").focusout(function (e) {
        e.preventDefault();
        if ($(this).val().trim() === "") {
            $(".usernameBox span").removeClass("usernameInputFocus");
        }
    });

});


function scrollChatBoxToBottom() {
    $('.chatBoxes').scrollTop($('.chatBoxes').prop('scrollHeight'));
}


function generateRandomString() {
    const randomArray = new Uint8Array(8); // 8 bytes = 16 hexadecimal characters
    window.crypto.getRandomValues(randomArray);
    const uniqueString = Array.from(randomArray)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    return uniqueString

}

window.addEventListener("click", function (e) {
    if (
        !document.getElementById("menu").contains(e.target) &&
        !document.getElementById("menuBotton").contains(e.target)
    ) {
        if (!$("#menu").hasClass("menuClose")) {
            $("#menu").addClass("menuClose");
        }
    }
});

function Togglemenu() {
    $("#menu").toggleClass("menuClose");
}

function SearchToggle() {
    $("#ChatTitle").toggleClass("hidden");
    $("#ChatTitle").toggleClass("flex");
    $("#searchBox").toggleClass("hidden");
    $("#searchBox").toggleClass("flex");
    if ($("#searchBox").hasClass("hidden")) {
        $("#txtSearch").focus();
    } else {
        $("#txtSearch").focus();

        $("#txtSearch").val("");
    }
}

// Emogi picker code:

const button = document.querySelector("#btnEmoji");

const picker = new EmojiButton();

button.addEventListener("click", () => {
    event.stopPropagation();
    picker.togglePicker(button);
    $(".emoji-picker__search-container").css("display", "none");
});

picker.on("emoji", (emoji) => {
    document.querySelector("#txtMessage").value += emoji;
    changeSendIconVisibility(true)
});



$('#input-file').change(function (evt) {

    $('#imagePreview').removeClass('hidden');
    const file = evt.target.files[0];
    console.log('file change');
    if (file) {
        const objectURL = URL.createObjectURL(file);
        $("#imgSrc").attr("src", objectURL);
    }
    window.addEventListener("click", function (e) {
        if (
            !document.getElementById("imgContainer").contains(e.target) &&
            !document.getElementById('imagePreview').classList.contains('hidden')
        ) {
            $('#imagePreview').addClass('hidden');
            $('#input-file').val('');
            console.log('close img');
        }
    });
});


