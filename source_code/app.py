from flask import Flask, render_template, redirect, jsonify 
from flask_pymongo import PyMongo
from bson.json_util import dumps, loads
import json

import population_ETL

# Flask Setup
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/populationDB")


# Flask Routes

# json API pages
@app.route('/api/population/latest')
def latest():
    latest = mongo.db.latestPopulation.find() # PYMONGO CURSOR 
    dump_latest = dumps(latest) # CONVERT PYMONGO CUSTOR TO JSON STRING 
    json_latest = json.loads(dump_latest) # CONVERT TO ACTUAL JSON 
    return jsonify(json_latest)  # RETURN JSON 

@app.route("/api/population/countries")
def countries():
    countries = mongo.db.countriesPopulation.find() # PYMONGO CURSOR 
    dump_countries = dumps(countries) # CONVERT PYMONGO CUSTOR TO JSON STRING 
    json_countries = json.loads(dump_countries) # CONVERT TO ACTUAL JSON 
    return jsonify(json_countries)   # RETURN JSON 

@app.route('/api/population/cities')
def cities():
    cities = mongo.db.citiesPopulation.find()
    dump_cities = dumps(cities)
    json_cities = json.loads(dump_cities)
    return jsonify(json_cities) 

@app.route('/api/population/world')
def world():
    data = mongo.db.worldPopulation.find()
    dump_data = dumps(data)
    json_data = json.loads(dump_data)
    return jsonify(json_data) 

@app.route('/api/population/density')
def density():
    data = mongo.db.populationDensity.find()
    dump_data = dumps(data)
    json_data = json.loads(dump_data)
    return jsonify(json_data) 

@app.route('/api/population/birth')
def birth():
    data = mongo.db.birthRate.find()
    dump_data = dumps(data)
    json_data = json.loads(dump_data)
    return jsonify(json_data) 

@app.route('/api/population/death')
def death():
    data = mongo.db.deathRate.find()
    dump_data = dumps(data)
    json_data = json.loads(dump_data)
    return jsonify(json_data) 

@app.route('/api/population/sex-ratio')
def sexRatio():
    data = mongo.db.sexRatio.find()
    dump_data = dumps(data)
    json_data = json.loads(dump_data)
    return jsonify(json_data) 


# html pages
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/countries-population')
def countriesPopulation():
    return render_template('countries-population.html') 

@app.route('/summary')
def summary():
    return render_template('summary.html')    

@app.route('/contact')
def contact():
    return render_template('contact.html')  

@app.route('/Data')
def Data():
    return render_template('Data.html')  

@app.route('/data-cities')
def dataCities():
    return render_template('data-cities.html') 

@app.route('/api')
def api():
    return render_template('api.html') 

@app.route('/header')
def header():
    return render_template('header.html') 

if __name__ == "__main__":
    app.run(debug=True)
