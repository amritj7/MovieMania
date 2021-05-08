import requests
import json

from flask import Flask
from flask import request
from flask_pymongo import PyMongo
import pymongo


app = Flask(__name__)

myclient = pymongo.MongoClient(
    "mongodb+srv://MovieMania:MovieMania@cluster0.g7zov.mongodb.net/mydatabase?retryWrites=true&w=majority")
mydb = myclient["mydatabase"]
movieCollection = mydb["movie"]
userCollection = mydb["user"]
# movieCollection : { movieID, rating{userCount, value, }, comments[{userID, commentText}]}
# userCollection : { userID, movies[{movieID}], ratedMovies[]}


@app.route('/search/<name>', methods=['POST', 'GET'])
def search(name):
    url = "https://api.themoviedb.org/3/search/multi?api_key=75b7e19a0927cfef46140801a9ae825b&language=en-US&query=" + \
        name + "&page=1"
    response = requests.request(
        "GET", url)

    return response.json()


@app.route('/display', methods=['POST', 'GET'])
def display():
    data = request.json
    movie = movieCollection.find_one({"movieID": data["movieID"]})
    print(movie)
    foundUser = userCollection.find_one({"userID": data["user"]})
    if not foundUser:
        foundUser = userCollection.insert_one(
            {"userID": data["user"], 'movies': [], 'ratedMovies': []})
    foundUser = userCollection.find_one({"userID": data["user"]})
    alreadyAdded = False
    for movieId in foundUser["movies"]:
        alreadyAdded = alreadyAdded or movieId == data["movieID"]
    if not alreadyAdded:
        userCollection.update(
            {"userID": data["user"]}, {"$push": {"movies": data["movieID"]}})
    if not movie:
        print("here")
        movieCollection.insert_one(
            {'movieID': data["movieID"], 'rating': {'userCount': 0, 'value': 0}, 'comments': []})
    movie = movieCollection.find_one({'movieID': data["movieID"]})
    user = userCollection.find_one({"userID": data["user"]})
    del movie["_id"]
    del user["_id"]
    return {"movie": movie, "user": user}


@app.route('/comment', methods=['POST', 'GET'])
def comment():
    print("hey")
    data = request.json
    print(data)
    movieCollection.update(
        {"movieID": data["movieID"]}, {"$push": {"comments": data["comment"]}})
    foundInMovies = movieCollection.find_one({'movieID': data["movieID"]})
    del foundInMovies["_id"]
    return foundInMovies


@app.route('/rate', methods=['POST', 'GET'])
def rate():
    data = request.json
    found = movieCollection.find_one({"movieID": data["movieID"]})
    print(found)
    foundUser = userCollection.find_one({'userID': data["user"]})
    for ratedMovie in foundUser["ratedMovies"]:
        if ratedMovie == data["movieID"]:
            return found
    currentRating = found["rating"]["value"]
    currentUserCount = found["rating"]["userCount"]
    updatedRating = (currentRating * currentUserCount +
                     data["rating"]) / (currentUserCount + 1)
    updatedUserCount = currentUserCount + 1
    movieCollection.update(
        {"movieID": data["movieID"]}, {"$set": {"rating": {"userCount": updatedUserCount, "value": updatedRating}}})
    found = movieCollection.find_one({"movieID": data["movieID"]})
    userCollection.update(
        {"userID": data["user"]}, {"$push": {"ratedMovies": data["movieID"]}})
    del found["_id"]
    return found


@app.route('/history', methods=['POST', 'GET'])
def history():
    data = request.json
    userData = userCollection.find_one({'userID': data["userID"]})
    del userData["_id"]
    userMovies = []
    for movieID in userData["movies"]:
        url = "https://imdb8.p.rapidapi.com/title/get-base"
        querystring = {"tconst": movieID[7:-1]}
        headers = {
            'x-rapidapi-key': "3f9ba87618msh49c8d10e3d0175cp1181e1jsnd39817a729d7",
            'x-rapidapi-host': "imdb8.p.rapidapi.com"
        }
        response = requests.request(
            "GET", url, headers=headers, params=querystring)
        print(response.text)
        movie = response.json()
        movieData = movieCollection.find_one({'movieID': movieID})
        del movieData["_id"]
        userMovies.append({"movie": movie, "movieData": movieData})

    return {"userData": userData, "userMovies": userMovies}
