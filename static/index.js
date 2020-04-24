document.addEventListener('DOMContentLoaded', () =>{
    if (!localStorage.getItem('display_name')){
        document.querySelector('#page').innerHTML = '';
       document.querySelector('#form').onsubmit = () => {
       var display_name = document.querySelector('#display_name').value;
       if ( display_name != ''){
            localStorage.setItem('display_name', display_name);
            alert('account created!');
       } else {
        alert('please enter your display name!');
        }   
       }
    } else {
        let display_name = localStorage.getItem('display_name');
        document.querySelector('#login_section').innerHTML = '';
        document.querySelector('#welcome').innerHTML += ` ${display_name}`;
    }
    const display_name = localStorage.getItem('display_name');
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // When connected, configure buttons
    socket.on('connect', () => {


                // By default, submit button is disabled
    document.querySelector('#submit').disabled = true;

                // Enable button only if there is text in the input field
    document.querySelector('#task').onkeyup = () => {
        if (document.querySelector('#task').value.length > 0)
            document.querySelector('#submit').disabled = false;
        else
            document.querySelector('#submit').disabled = true;
    };

    document.querySelector('#new_channel').onsubmit = () => {

        const channel_name = document.querySelector('#task').value;
        socket.emit('create channel', {'channel_name': channel_name, 'display_name': display_name});

                // Clear input field and disable button again
        document.querySelector('#task').value = '';
        document.querySelector('#submit').disabled = true;

        // Stop form from submitting
        return false;
    };
    });

    // When a new vote is announced, add to the unordered list
    socket.on('channels', data => {

                    // Create new item for list
        const a = document.createElement('a');
        a.className = "list-group-item list-group-item-action list-group-item-primary";
        a.innerHTML =  `${data.channel_name} by ${data.channel_creator}`;
        
                // Add new item to task list
        document.querySelector('#channel').append(a);
        
    });

});
