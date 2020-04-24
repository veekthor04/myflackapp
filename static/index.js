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
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        // Each button should emit a "submit vote" event
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
        const new_channel = document.querySelector('#task').value;
        socket.emit('submit vote', {'new_channel': new_channel, 'channel_creator': display_name });
        // Clear input field and disable button again
        document.querySelector('#task').value = '';
        document.querySelector('#submit').disabled = true;
        // Stop form from submitting
        return false;
        };
    });

    // When a new vote is announced, add to the unordered list
    socket.on('channels', data => { data.forEach((k, v) => {
        // Create new item for list
            const a = document.createElement('a');
            a.className = "list-group-item list-group-item-action list-group-item-primary";
            a.innerHTML = k;
            // Add new item to task list
            document.querySelector('#channel').append(a);

    });
        
    });

});
