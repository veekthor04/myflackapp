
document.addEventListener('DOMContentLoaded', () =>{
	const display_name = localStorage.getItem('display_name');
	const channel_id = localStorage.getItem('channel_id');
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

    	document.querySelector('#new_message').onsubmit = () => {
    		var newDate = new Date();
			dateString = newDate.toUTCString();

        	const new_message = document.querySelector('#task').value;
        	socket.emit('add message', {'message': new_message, 'sender': display_name,'time': dateString, 'channel_id': channel_id});

            // Clear input field and disable button again
        	document.querySelector('#task').value = '';
        	document.querySelector('#submit').disabled = true;
       		// Stop form from submitting
        	return false;
   		 };
    }); 

        // When a new vote is announced, add to the unordered list
    socket.on('new message', data => {

                    // Create new item for list
        const a = document.createElement('div');
        const b = document.createElement('div');
        const c = document.createElement('blockquote');
        const d = document.createElement('p');
        const e = document.createElement('footer');
        const f = document.createElement('cite');
        a.className = "card";
        if (data.sender === display_name)
        	a.setAttribute("id", "chat_box1");
        else
        	a.setAttribute("id", "chat_box2");
        b.setAttribute("class", "card-body");
        c.setAttribute("class", "blockquote mb-0");
        e.setAttribute("class", "blockquote-footer");
        f.setAttribute("title", "Source Title");
        d.innerHTML = data.message;
        e.innerHTML = `${data.sender} @`;
        f.innerHTML = data.time;
        e.innerHTML += f.outerHTML;
        c.innerHTML = d.outerHTML + e.outerHTML
        b.innerHTML = c.outerHTML;
        a.innerHTML = b.outerHTML;

                // Add new item to task list
        document.querySelector('#message').append(a);
        
    });

});


// <div class="card" id="chat_box1">
// 	<div class="card-body">
// 	<blockquote class="blockquote mb-0">
// 				<p>{{message['message']}}</p>
// 				<footer class="blockquote-footer">{{message['sender']}} @<cite title="Source Title">{{message['time']}}</cite></footer>
// 	</blockquote>
// 	</div>
// </div>