import sys
import json
import os
sys.path.insert(1, os.path.join(os.path.abspath("."), 'venv/Lib/site-packages'))

from flask import Flask, request
from flask import render_template
app = Flask(__name__)
from google.appengine.api import memcache

@app.route('/', methods=['GET'])
def render_html():
    user = memcache.get("user")
    if user is None:
        pass #render loginview
    else:
        print "Got value: " + user # return early and render dash

    return render_template('base.html')

@app.route('/get', methods=['GET'])
def get():
    context = {"login": 1, #users.create_login_url('/'),
               "logout": 2 # users.create_logout_url('/')
               }
    jsonout = json.dumps(context)
    return jsonout

@app.route('/post', methods=['POST'])
def post():
    print request.data
    memcache.set("user", request.data)
    response_data = json.dumps({"set-user": request.data})
    return response_data

if __name__ == '__main__':
    app.run()
