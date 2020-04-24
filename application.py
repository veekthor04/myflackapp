import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {'channel_name': {'channel_name': 'talk', 'channel_creator': 'thor'}}

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("create_channel")
def create_channel(data):
    new_channel = data['new_channel']
    diplay_name = data['diplay_name']
    channels[new_channel] = {'channel_name': new_channel, 'channel_creator': diplay_name}
    emit("channels", channels, broadcast=True)
