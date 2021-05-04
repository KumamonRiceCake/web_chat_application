let socket = io();

//Scroll to the bottom when messages go below the page
function scrollToBottom () {
    // Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child'); //get the last list item in the list

    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight(); //lastMessageHeight before adding a new message

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

let params = jQuery.deparam(window.location.search);  //Includes name, room, password

//Joining the room
socket.on('connect', function() {
    socket.emit('joinRoom', params, function (err) {
        //acknowlegment
        if(err) {
            alert(err);
            window.location.href = '/';
        }
    });
});

//Disconnect
socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

//Update user list
socket.on('updateUserList', function(users) {
    let ol = jQuery('<ol></ol>');

    //Append users to the ordered list
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    //Update the user list in the ordered list
    jQuery('#users').html(ol);
});

//New message event
socket.on('newMessage', function(message, id) {
    let formattedTime = moment(message.timeStamp).format('h:mm a');
    let template;

    //Self message template
    if (socket.id === id) {
        template = jQuery('#self-message-template').html();
    }
    //Message from outside template
    else {
        template = jQuery('#message-template').html();
    }

    //Mustache template for a single message
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        timeStamp: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();   //Scroll down after updates
});

jQuery('#roomHeader').html(params.room);    //Update the chat room header to the room name

//Create a new message
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    let messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});
