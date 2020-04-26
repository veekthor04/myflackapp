import os
import requests


from flask import Flask, jsonify, render_template, request,redirect
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = [{'channel_name': 'talk', 'channel_creator': 'thor','messages':[{'message':'welcome', 'sender': 'vic','time': '10:11'},{'message':'welcome', 'sender': 'vic','time': '10:11'}] }, {'channel_name': 'talk2', 'channel_creator': 'thor2','messages':[{'message':'welcome', 'sender': 'vic','time': '10:11'},{'message':'welcome', 'sender': 'vic','time': '10:11'}]}]

@app.route("/")
def index():
    return render_template("index.html", channels=channels)

@socketio.on("create channel")
def create_channel(data):
    new_channel = data['channel_name']
    display_name = data['display_name']
    channels.append({'channel_name': new_channel, 'channel_creator': display_name})
    emit("channels", {'channel_name': new_channel, 'channel_creator': display_name}, broadcast=True)

@app.route("/channel/<int:channel_id>")
def channel(channel_id):
	try:
		channel_name = channels[channel_id]['channel_name']
	except IndexError:
		return	redirect("/")
	messages = channels[channel_id]['messages']
	return render_template("channel.html", channel_name=channel_name, channel_id=channel_id , messages=messages )

# @app.route("/posts", methods=["POST"])
# def posts():
# 	data = channels[channel_id]['messages']
# 	return jsonify(data)

@socketio.on("add message")
def add_message(data):
    channel_id = data['channel_id']
    del data['channel_id']
    channels[channel_id]['messages'].append(data)
    message = data['message']
    sender = data['sender']
    time = data['time']
    emit("new message", {'message': message, 'sender': sender, 'time': time, 'channel_id': channel_id}, broadcast=True)