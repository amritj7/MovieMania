import requests, json

from flask import Flask
app = Flask(__name__)

@app.route('/search/<name>')
def search(name):
	url = "https://imdb8.p.rapidapi.com/auto-complete"
	querystring = {"q":name}
	headers = {
		'x-rapidapi-key': "319ebe4cf1msha602967cc60d6c6p1cafdbjsn7078064544f6",
		'x-rapidapi-host': "imdb8.p.rapidapi.com"
	}
	response = requests.request("GET", url, headers=headers, params=querystring)
	return json.dumps(response.json()['d'][:min(5,len(response.json()['d']))])