import requests
import json

from flask import Flask
from flask import request
from flask_pymongo import PyMongo
import pymongo

app = Flask(__name__)

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydatabase"]
movieCollection = mydb["movie"]
userCollection = mydb["user"]
# movieCollection : { movieID, rating{userCount, value, }, comments[{userID, commentText}]}
# userCollection : { userID, movies[{movieID}], ratedMovies[]}


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


@app.route('/display/<movieID>', methods=['POST', 'GET'])
def display(movieID):
    data = request.json
    movie = movieCollection.find_one({"movieID": movieID})
    foundUser = userCollection.find_one({"userID": data["user"]})
    if not foundUser:
        foundUser = userCollection.insert_one(
            {"userID": data["user"], 'movies': [], 'ratedMovies': []})
    userCollection.update(
        {"userID": data["user"]}, {"$push": {"movies": movieID}})
    print(userCollection.find_one({"userID": data["user"]}))
    if not movie:
        movieCollection.insert_one(
            {'movieID': movieID, 'rating': {'userCount': 0, 'value': 0}, 'comments': []})
    movie = movieCollection.find_one({'movieID': movieID})
    user = userCollection.find_one({"userID": data["user"]})
    del movie["_id"]
    del user["_id"]
    return {"movie": movie, "user": user}


@app.route('/comment/<movieID>', methods=['POST', 'GET'])
def comment(movieID):
    print("hey")
    data = request.json
    print(data)
    movieCollection.update(
        {"movieID": movieID}, {"$push": {"comments": data}})
    foundInMovies = movieCollection.find_one({'movieID': movieID})
    del foundInMovies["_id"]
    return foundInMovies


@app.route('/rate', methods=['POST', 'GET'])
def rate():
    data = request.json
    found = movieCollection.find_one({"movieID": data["movieID"]})
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
    for movieID in userData["movies"] : 
        url = "https://imdb8.p.rapidapi.com/auto-complete"
        querystring = {"i": movieID,"r":"json"}

        headers = {
            'x-rapidapi-key': "319ebe4cf1msha602967cc60d6c6p1cafdbjsn7078064544f6",
            'x-rapidapi-host': "imdb8.p.rapidapi.com"
            }

        response = requests.request("GET", url, headers=headers, params=querystring)
        print(response.text)
        movie = response.text
        movieData = movieCollection.find_one({'movieID': movieID})
        del movieData["_id"]
        userMovies.append({"movie" : movie, "movieData" : movieData})
    
    return {"userData" : userData, "userMovies" : userMovies}
