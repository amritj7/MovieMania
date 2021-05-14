import requests
import json

from google.oauth2 import id_token
from google.auth.transport import requests as req
from flask import Flask
from flask import request
from flask import abort
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin
import pymongo
import secrets
import string


app = Flask(__name__)
cors = CORS(app, resources={
            r"*": {"origins": "http://localhost:3000,https://xmovie-xmania.netlify.app"}})
myclient = pymongo.MongoClient(
    "mongodb+srv://MovieMania:MovieMania@cluster0.g7zov.mongodb.net/mydatabase?retryWrites=true&w=majority")
mydb = myclient["mydatabase"]
movieCollection = mydb["movie"]
userCollection = mydb["user"]
# movieCollection : { movie, rating{userCount, value}, comments[{userID, commentText}]}
# userCollection : { secretPhrase, userID, movies[{movie}], ratedMovies[{movie}]}

@app.route('/auth', methods=['POST', 'GET'])
@cross_origin()
def auth():
    data = request.json
    data = data["token"]
    try:
        idinfo = id_token.verify_oauth2_token(data["tokenObj"]["id_token"], req.Request(), "427815533001-v7anb53c19e0n5a0ru1af933v24e3mev.apps.googleusercontent.com")
        foundUser = userCollection.find_one({"userID": data["profileObj"]["email"]})
        if not foundUser:
            #generate string and insert user
            res = ''.join(secrets.choice(string.ascii_uppercase + string.digits)
                                                  for i in range(15))
            res = str(res)
            userCollection.insert_one({"userID": data["profileObj"]["email"], "movies": [], "ratedMovies": [], "secretPhrase" : res})
            foundUser = userCollection.find_one({"userID": data["profileObj"]["email"]})
        del foundUser["_id"]    
        return foundUser
    except ValueError:
        abort(404)                                   

@app.route('/search/<name>', methods=['POST', 'GET'])
@cross_origin()
def search(name):
    url = "https://api.themoviedb.org/3/search/multi?api_key=75b7e19a0927cfef46140801a9ae825b&language=en-US&query=" + \
        name + "&page=1"
    response = requests.request(
        "GET", url)

    return json.dumps(response.json()["results"][:5])


@app.route('/display', methods=['POST', 'GET'])
@cross_origin()
def display():
    data = request.json
    foundMovie = movieCollection.find_one({"movie": data["movie"]})
    foundUser = userCollection.find_one({"userID": data["user"]})
    if not foundUser["secretPhrase"] == data["secretPhrase"]:
        abort(404)
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
@cross_origin()
def comment():
    data = request.json
    foundUser = userCollection.find_one({"userID": data["user"]})
    if not foundUser["secretPhrase"] == data["secretPhrase"]:
        abort(404)
    movieCollection.update(
        {"movie": data["movie"]}, {"$push": {"comments": data["comment"]}})
    foundInMovies = movieCollection.find_one({'movie': data["movie"]})
    del foundInMovies["_id"]
    return foundInMovies


@app.route('/rate', methods=['POST', 'GET'])
@cross_origin()
def rate():
    data = request.json
    found = movieCollection.find_one({"movie": data["movie"]})
    foundUser = userCollection.find_one({'userID': data["user"]})
    if not foundUser["secretPhrase"] == data["secretPhrase"]:
        abort(404)
    for ratedMovie in foundUser["ratedMovies"]:
        if ratedMovie == data["movie"]:
            return found
    currentRating = found["rating"]["value"]
    currentUserCount = found["rating"]["userCount"]
    updatedRating = float((float(currentRating) * float(currentUserCount) +
                           float(data["rating"])) / float((currentUserCount + 1)))
    updatedRating = format(updatedRating, '.1f')

    updatedUserCount = currentUserCount + 1
    movieCollection.update(
        {"movie": data["movie"]}, {"$set": {"rating": {"userCount": updatedUserCount, "value": updatedRating}}})
    found = movieCollection.find_one({"movie": data["movie"]})
    userCollection.update(
        {"userID": data["user"]}, {"$push": {"ratedMovies": data["movie"]}})
    del found["_id"]
    return found


@app.route('/history', methods=['POST', 'GET'])
@cross_origin()
def history():
    data = request.json
    userData = userCollection.find_one({'userID': data["user"]})
    if not userData["secretPhrase"] == data["secretPhrase"]:
        abort(404)
    del userData["_id"]
    userMovies = []
    for foundMovie in userData["movies"]:
        movieData = movieCollection.find_one({'movie': foundMovie})
        del movieData["_id"]
        userMovies.append({"movie": foundMovie, "movieData": movieData})
    return {"userData": userData, "userMovies": userMovies}
