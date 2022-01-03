from flask import Flask, render_template
from boggle import Boggle

app = Flask(__name__)

boggle_game = Boggle()

@app.route('/')
def homepage():
    return render_template('index.html')
