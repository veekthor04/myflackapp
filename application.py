import os
import requests


from flask import Flask, jsonify, render_template, request,redirect
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []
max_msg = 100
@app.route("/")
def index():
	# renders homepage
    return render_template("index.html", channels=channels)

@socketio.on("create channel")
def create_channel(data):
	# creates new channel
    new_channel = data['channel_name']
    display_name = data['display_name']
    channel_id = len(channels)
    channels.append({'channel_name': new_channel, 'channel_creator': display_name})
    channels[channel_id]['messages'] = []
    #emits the channel created
    emit("channels", {'channel_name': new_channel, 'channel_creator': display_name, 'channel_id': channel_id}, broadcast=True)

@app.route("/channel/<int:channel_id>")
def channel(channel_id):
	# open channel page for chat
	try:
		channel_name = channels[channel_id]['channel_name']
	except IndexError:
		return	redirect("/")
	return render_template("channel.html", channel_name=channel_name, channel_id=channel_id )

@socketio.on("add message")
def add_message(data):
	# adds new message to the channel 
    channel_id = data['channel_id']
    del data['channel_id']
    msg_length = len(channels[channel_id]['messages'])
    if len(channels[channel_id]['messages']) >= max_msg:
        channels[channel_id]['messages'].pop(0)
    channels[channel_id]['messages'].append(data)
    message = data['message'].strip()
    sender = data['sender']
    time = data['time'].strip()
    #emits the message added
    emit("new message", {'message': message, 'sender': sender, 'time': time,'msg_length': msg_length, 'channel_id': channel_id}, broadcast=True)

@app.route("/posts", methods=["POST"])
def posts():

    # get axisting messages for the channel
    channel_id = int(request.form.get("channel_id"))
    return jsonify(channels[channel_id]['messages'])

@app.route("/delete", methods = ["POST"])
def delete():
	# deletes the message from the channel 
    channel_id = int(request.form.get("channel_id"))
    message = request.form.get("message").strip()
    time = request.form.get("time").strip()
    sender  = request.form.get("sender")
   	# checks for the message
    for index in range(len(channels[channel_id]['messages'])):
    	if(channels[channel_id]['messages'][index]['sender'] == sender and channels[channel_id]['messages'][index]['time'] == time ):
        	del channels[channel_id]['messages'][index]

    return '', 204
