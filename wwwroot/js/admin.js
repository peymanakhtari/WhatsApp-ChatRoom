

$(document).ready(function () {

    $('.deleteMessage').click(function (e) {
        const message = $(this).data('messageid');
        const messageType = $(this).data('messagetype');
        const filename = $(this).data('filename');
        $.ajax({
            type: "post",
            url: "Admin/deleteMessage",
            data: { id: message, messageType: messageType, fileName: filename },
            success: function () {
                window.location.reload();
            },
            error: function () {
                console.log('error');
            }
        });
    });

});