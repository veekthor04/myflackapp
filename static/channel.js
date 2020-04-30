
document.addEventListener('DOMContentLoaded', () =>{
	const display_name = localStorage.getItem('display_name');
    const max_msg = 100;
    localStorage.setItem('channel_id', channel_id);

    const request = new XMLHttpRequest();
        request.open('POST', '/posts');
            request.onload = () => {
            const data = JSON.parse(request.responseText);
            data.forEach(add_post)
        };

        // Add start and end points to request data.
        const data = new FormData();
        data.append('channel_id', channel_id);

        // Send request.
        request.send(data);

        function add_post(data1){
            console.log(data1); 
                                // Create new item for list
            const chat_div =   document.createElement('div');
            chat_div.setAttribute("class", "speechbubble");
            if (data1.sender === display_name)
                chat_div.setAttribute("id", "speech2");
            else
                chat_div.setAttribute("id", "speech1");
            const box =   document.createElement('p');
            box.innerHTML = `${data1.message} @ ${data1.time}`;
            const box2 =   document.createElement('span');
            box2.setAttribute("class", "username");
            box2.innerHTML = data1.sender;
            box.append(box2);
            chat_div.append(box);
            const hide = document.createElement('a');
            hide.className = 'myButton';
            hide.innerHTML = 'delete';
            if (data1.sender === display_name)
            chat_div.append(hide);
        // When hide button is clicked, remove post.
            hide.onclick = function() {
                var delMessage = this.parentElement.innerHTML;
                var msg = delMessage.split('>').pop().split('@')[0];
                var time = delMessage.split('@').pop().split('<')[0];  
                console.log(msg)
                this.parentElement.remove();

                let request = new XMLHttpRequest;
                let data1 = new FormData;
                data1.append("channel_id", channel_id);
                data1.append("sender", display_name);
                data1.append("message", msg);
                data1.append("time", time);
                request.open("POST", "/delete");
                request.send(data1);

            };
            document.querySelector('#msg').append(chat_div);
            console.log(chat_div.outerHTML);

                // Add new item to task list
            
        }
  
         // Connect to websocket
        var socket = io.connect('https://' + document.domain + ':' + location.port);
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

    socket.on('delete', () => {
        document.querySelectorAll('#delete').onclick = () => {

        }

    }); 

        // When a new vote is announced, add to the unordered list
    socket.on('new message', data => {

        const chat_div =   document.createElement('div');
        chat_div.setAttribute("class", "speechbubble");
        if (data.sender === display_name)
            chat_div.setAttribute("id", "speech2");
        else
            chat_div.setAttribute("id", "speech1");
        const box =   document.createElement('p');
        box.innerHTML = `${data.message} @ ${data.time}`;
        const box2 =   document.createElement('span');
        box2.setAttribute("class", "username");
        box2.innerHTML = data.sender;
        box.append(box2);
        chat_div.append(box);
        const hide = document.createElement('a');
        hide.className = 'myButton';
        hide.innerHTML = 'delete';
        if (data.sender === display_name)
            chat_div.append(hide);

        // When hide button is clicked, remove post.

        hide.onclick = function() {
            var delMessage = this.parentElement.innerHTML;
            var msg = delMessage.split('>').pop().split('@')[0];
            var time = delMessage.split('@').pop().split('<')[0];
            console.log(msg)
            this.parentElement.remove();

            let request = new XMLHttpRequest;
            let data = new FormData;
            data.append("channel_id", channel_id);
            data.append("sender", display_name);
            data.append("message", msg);
            data.append("time", time);
            request.open("POST", "/delete");
            request.send(data);     

        };
        if(data.channel_id === channel_id){
            document.querySelector('#msg').append(chat_div);
            if(data.msg_length >= max_msg)
                document.querySelector(".speechbubble").remove();
        }
        
    });
    
    document.querySelector('#leave').onclick = () => {
        localStorage.removeItem("channel_id");
        window.location.href = `/`;
    }

});
