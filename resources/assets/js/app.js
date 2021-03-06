// Enable pusher logging - don't include this in production
Pusher.log = function (message) {
    if (window.console && window.console.log) {
        window.console.log(message);
    }
};

var pusher = new Pusher('3c511981ee118763016d', {
    encrypted: true
});

window.lock = false;

var chat = pusher.subscribe('chat');

chat.bind('App\\Events\\MessageWasSent', function (data) {
    $('#messages').append($('<p><strong>' + data.message.author + '</strong> [' + data.message.created_at + ']: ' + data.message.content + '</p>').hide().fadeIn(500));

    if ($('#messages p').length > 10) {
        $('#messages p:first-of-type').fadeOut(500).remove();
    }
});

$('#sendMessage').submit(function (e) {
    e.preventDefault();
    var vm = $(this);
    var errors = $('.errors');
    errors.hide().text('');

    if (window.lock === false) {
        window.lock = true;
        $.post('chat/new', vm.serialize()).done(function () {
            vm.find('textarea').val('');
            window.lock = false;
        }).fail(function (data) {
            window.lock = false;
            var response = $.parseJSON(data.responseText);
            errors.show();
            $.each(response, function (key, value) {
                errors.append('<p>' + value + '</p>');
            });
        });
    }
});

$('textarea').keypress(function (e) {
    if (e.which == 13) {
        $(this).closest('form').submit();
        return false;
    }
});