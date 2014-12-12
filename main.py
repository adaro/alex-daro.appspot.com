import sys
import json
import os
sys.path.insert(1, os.path.join(os.path.abspath("."), 'venv/Lib/site-packages'))

from flask import Flask, request
from flask import render_template
from utils import MovieSearch


app = Flask(__name__)

@app.route('/', methods=['GET'])
def render_html():
    return render_template('index.html')

@app.route('/get', methods=['GET'])
def get():
    movies = MovieSearch()
    print movies.data
    jsonout = json.dumps(movies.data)
    return jsonout

@app.route('/post', methods=['POST'])
def post():
    jsonout = json.loads(request.data)["data"]
    print jsonout
    response_data = json.dumps({"response_data": "yo"})
    return response_data

if __name__ == '__main__':
    app.run()
