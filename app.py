import requests
import json

from flask import Flask
from flask_pymongo import PyMongo
import pymongo

app = Flask(__name__)

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydatabase"]
movieCollection = mydb["movie"]

@app.route('/search/<name>', methods=['POST', 'GET'])
def search(name):
    url = "https://imdb8.p.rapidapi.com/auto-complete"
    querystring = {"q": name}
    headers = {
        'x-rapidapi-key': "319ebe4cf1msha602967cc60d6c6p1cafdbjsn7078064544f6",
        'x-rapidapi-host': "imdb8.p.rapidapi.com"
    }
    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    return json.dumps(response.json()['d'][:5])

@app.route('/display/<id>', methods=['POST', 'GET'])
def display(id):
    movie = movieCollection.find_one({'id' : id})
    if not movie:
        movie = movieCollection.insert_one({'id' : id, 'rating' : {'userCount' : 0, 'ratings' : 0}, 'comments' : []})
    del movie["_id"]
    return movie



# @app.route('/comment', methods=['POST', 'GET'])
# def comment():
# 	data = request.get_json()
# 	foundInMovies = mongo.db.movie.find_one({'id' : data.movieID})
# 	user = mongo.db.movie.find_one({'userID' : data.userID})
# 	if not data.movieID in user.movies :
# 		user.movies.append(data.movieID)
# 	if foundInMovies :
# 		foundInMovies.comments.append(data.comment)
# 	else :
# 		mongo.db.movie.insert_one({'id' : data.movieID, 'rating' : {0, 0}, 'comments' : [{data.comment}]})
#     return mongo.db.movie.find_one({'id' : data.movieID})

# @app.route('/rate', methods=['POST', 'GET'])
# def rate():
# 	data = request.get_json()
# 	found = mongo.db.movie.find_one({'id' : data.id})
# 	if found :
# 		found.rating.value = (found.rating.value * found.rating.count + data.rating)/(found.rating.count + 1)
# 		found.rating.count = found.rating.count + 1
# 	else :
# 		mongo.db.movie.insert_one({'id' : data.id, 'rating' : {data.rating, 1}, 'comments' : []})
# 	return mongo.db.movie.find_one({'id' : data.id})

# @app.route('/history', methods=['POST', 'GET'])
# def history():
# 	data = request.get_json()
# 	user = mongo.db.user.find_one({'userID' : data.userID})
# 	user.movies.append(data.movie)
