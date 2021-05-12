import requests
import json

from flask import Flask
from flask import request
from flask_pymongo import PyMongo
from flask_cors import CORS
import pymongo


app = Flask(__name__)
cors = CORS(app, resources={
            r"/api/*": {"origins": "https://xmovie-maniax.netlify.app"}})
myclient = pymongo.MongoClient(
    "mongodb+srv://MovieMania:MovieMania@cluster0.g7zov.mongodb.net/mydatabase?retryWrites=true&w=majority")
mydb = myclient["mydatabase"]
movieCollection = mydb["movie"]
userCollection = mydb["user"]
# movieCollection : { movie, rating{userCount, value}, comments[{userID, commentText}]}
# userCollection : { userID, movies[{movie}], ratedMovies[{movie}]}


@cross_origin()
@app.route('/search/<name>', methods=['POST', 'GET'])
def search(name):
    url = "https://api.themoviedb.org/3/search/multi?api_key=75b7e19a0927cfef46140801a9ae825b&language=en-US&query=" + \
        name + "&page=1"
    response = requests.request(
        "GET", url)

    return json.dumps(response.json()["results"][:5])


@app.route('/display', methods=['POST', 'GET'])
def display():
    data = request.json
    foundMovie = movieCollection.find_one({"movie": data["movie"]})
    print(data["movie"])
    foundUser = userCollection.find_one({"userID": data["user"]})
    if not foundUser:
        foundUser = userCollection.insert_one(
            {"userID": data["user"], 'movies': [], 'ratedMovies': []})
    foundUser = userCollection.find_one({"userID": data["user"]})
    alreadyAdded = False
    for movie in foundUser["movies"]:
        alreadyAdded = alreadyAdded or movie == data["movie"]
    if not alreadyAdded:
        userCollection.update(
            {"userID": data["user"]}, {"$push": {"movies": data["movie"]}})
    if foundMovie == None:
        movieCollection.insert_one(
            {'movie': data["movie"], 'rating': {'userCount': 0, 'value': 0}, 'comments': []})
    foundMovie = movieCollection.find_one({'movie': data["movie"]})
    user = userCollection.find_one({"userID": data["user"]})

    del foundMovie["_id"]
    del user["_id"]
    return {"movie": foundMovie, "user": user}


@app.route('/comment', methods=['POST', 'GET'])
def comment():
    data = request.json
    print(data)
    movieCollection.update(
        {"movie": data["movie"]}, {"$push": {"comments": data["comment"]}})
    foundInMovies = movieCollection.find_one({'movie': data["movie"]})
    del foundInMovies["_id"]
    return foundInMovies


@app.route('/rate', methods=['POST', 'GET'])
def rate():
    data = request.json
    found = movieCollection.find_one({"movie": data["movie"]})
    foundUser = userCollection.find_one({'userID': data["user"]})
    for ratedMovie in foundUser["ratedMovies"]:
        if ratedMovie == data["movie"]:
            return found
    currentRating = found["rating"]["value"]
    currentUserCount = found["rating"]["userCount"]
    updatedRating = (currentRating * currentUserCount +
                     data["rating"]) / (currentUserCount + 1)
    updatedUserCount = currentUserCount + 1
    movieCollection.update(
        {"movie": data["movie"]}, {"$set": {"rating": {"userCount": updatedUserCount, "value": updatedRating}}})
    found = movieCollection.find_one({"movie": data["movie"]})
    userCollection.update(
        {"userID": data["user"]}, {"$push": {"ratedMovies": data["movie"]}})
    del found["_id"]
    return found


@app.route('/history', methods=['POST', 'GET'])
def history():
    data = request.json
    userData = userCollection.find_one({'userID': data["userID"]})
    del userData["_id"]
    userMovies = []
    for foundMovie in userData["movies"]:
        movieData = movieCollection.find_one({'movie': foundMovie})
        del movieData["_id"]
        userMovies.append({"movie": foundMovie, "movieData": movieData})
    return {"userData": userData, "userMovies": userMovies}
