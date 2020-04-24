import os
import requests


from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {'talk': {'channel_name': 'talk', 'channel_creator': 'thor'},'talk2': {'channel_name': 'talk2', 'channel_creator': 'thor2'}}

@app.route("/")
def index():
    return render_template("index.html", channels=channels)

@socketio.on("create channel")
def create_channel(data):
    new_channel = data['channel_name']
    display_name = data['display_name']
    channels[new_channel] = {'channel_name': new_channel, 'channel_creator': display_name}
    emit("channels", {'channel_name': new_channel, 'channel_creator': display_name}, broadcast=True)
