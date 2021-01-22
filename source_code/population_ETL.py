import pandas as pd
import pymongo
import numpy as np
from geopy.geocoders import Nominatim

def ETL_process():
    # Cities Data
    #####################################################
    # url to scrape for the city population
    cities_url ="https://worldpopulationreview.com/world-cities"
    # Use pandas `read_html` to parse the url
    df_cityPop = pd.read_html(cities_url, header=0)[0]
    # rename the columns
    df_cityPop.rename(columns={'Name':'City', 
                            '2020 Population':'2020',
                            '2019 Population':'2019'
                            },inplace=True)
    # Replace null values with 0
    df_cityPop.fillna(0,inplace = True)
    #  converting column 2019 from float to int
    df_cityPop['2019'] = df_cityPop['2019'].apply(np.int32)



    # Using geopy for coordinates of top 10 cities
    #####################################################
    # creating a dataframe with coordinates
    cities = []
    # iterate through top 10 rows
    for row in df_cityPop.head(10).itertuples():
        try:
            geolocator = Nominatim(user_agent="population_analysis")
            city = row[2]
            country = row[3]
            loc = geolocator.geocode(city+','+ country)
            
            cities.append({"City": city,
                        "Country": country,
                        "Latitude": loc.latitude, 
                        "Longitude": loc.longitude}) 
        except:
            print("City not found. Skipping...") 

    city_df = pd.DataFrame(cities)
    # merging city dataframes 
    df_cityPop = df_cityPop.merge(city_df, on=["City","Country"], how="left")
    # Replace null values with 0
    df_cityPop.fillna(0,inplace = True)
    #####################################################




    # Scraping Country codes to merge datasets with
    #####################################################
    # url to scrape for ISO 3166 country codes Alpha-2 and Alpha-3 from www.iban.com
    country_code_url ="https://www.iban.com/country-codes"
    # Use panda's `read_html` to parse the url
    df_countryCode = pd.read_html(country_code_url, header=0)[0]
    # eliminating unnessasary data
    df_countryCode = df_countryCode.iloc[:,[1,2]]
    # rename the columns
    df_countryCode.rename(columns={'Alpha-2 code':'Country_Code_2',
                                'Alpha-3 code':'Country_Code'
                                },inplace=True)
    #####################################################


    # Countries Population Data
    #####################################################
    # read Countries population data from csv(source:https://worldpopulationreview.com) into dataframe
    df_countries = pd.read_csv('static/data/countriesData.csv')
    # rename the columns
    df_countries.rename(columns={'cca2':'Country_Code_2',
                                'name':'Country',
                                'pop2050':'2050',
                                'pop2030':'2030',
                                'pop2020':'2020',
                                'pop1980':'1980',
                                'pop1970':'1970'
                                },inplace=True)

    # eliminating flag column and rerodering
    df_countries = df_countries.iloc[:,[0,1,4,5,2,10,11,12,13,14,15,16]]

    # Removing decimal point from data
    col_list = ['2050','2030','2020','1980','1970']
    # Loop through the columns
    for col in df_countries[col_list]:
        # performing operations on columns other than Country column
        if col not in ["Country_Code_2", "Country"]:
            # correcting the decimal positions
            df_countries[col] = (df_countries[col] * 1000).apply(np.int64)





    # Another Dataset to merge for additional years data
    #####################################################
    # Cleaning csv Population data from https://datacatalog.worldbank.org
    # reading csv's into dataframes
    df_population = pd.read_csv('static/data/population.csv')


    # Function to Clean each dataframes
    def clean_dataFrames(df, col_list):
        # eliminating unnecessary data
        df = df.iloc[0:217, col_list]
        # renaming columns
        df.rename(columns= {df.columns[0]: "Name"}, inplace = True)
        df = df.rename(columns = lambda x : (str(x)[:-9]))
        df.rename(columns= {df.columns[0]: "Country", df.columns[1]: "Country_Code"}, inplace = True)
        return df

    # list of required column indexes
    col_list = [2,3,4,5,10,11,12,13,14]
    # Calling clean_dataFrames function passing the dataframe as parameter
    df_population = clean_dataFrames(df_population, col_list)

    # replacing string ".." value in data
    df_population = df_population.replace("..", 0)

    # Loop through the columns to covert values from string to 
    for col in df_population:
        # on columns other than Country and Country_Code_2
        if col not in ["Country_Code", "Country"]:
            # Converting string to number
            df_population[col] = df_population[col].astype(float).apply(np.int64)



    # merging two dataframes for additional years data
    #####################################################

    # merging df_population with df_countryCode
    df_population = df_countryCode.merge(df_population, on="Country_Code", how="inner")

    # merging df_population with df_countries
    df_countries_merged = df_countries.merge(df_population, on="Country_Code_2", how="inner")

    # removing duplicated Country column and Country_Code_2
    df_countries_merged = df_countries_merged.drop(['Country_y', 'Country_Code_2'], axis=1)
    # renaming columns
    df_countries_merged.rename(columns= {"Country_x": "Country"}, inplace = True)
    # reordering the columns
    df_countries_merged = df_countries_merged.iloc[:,[0,11,1,2,3,18,17,16,15,14,13,12,4,5,6,7,8,9,10]]
    # Replace null values with 0
    df_countries_merged.fillna(0,inplace = True)

    # Keeping a dataframe of Countries and country codes
    df_countries = df_countries_merged.iloc[:,[0,1]]
    #####################################################

    #####################################################



    # World Population and Projections
    #####################################################
    # read World population data from csv(source:https://worldpopulationreview.com) into dataframe
    df_worldPop = pd.read_csv('static/data/worldPopulation.csv')
    # Sort in ascending order
    df_worldPop.sort_values(by=["year"], inplace=True)
    # Projections
    df_worldPojection = pd.read_csv('static/data/worldProjections.csv')

    # Concatenate both actuals and projections dataframe
    df_worldPop = pd.concat([df_worldPop,df_worldPojection])
    # rename the columns
    df_worldPop.rename(columns={'value':'Population'},inplace=True)
    # Replace null values with 0
    df_worldPop.fillna(0,inplace = True)
    #####################################################




    # Countries Population Density, Birth Rate, Reath Rate and Sex Ratio
    #####################################################
    # Defining a function to clean similar dataframes
    def cleanData(df, col_list, subset):
        #  eliminating unnecessary data
        df = df.iloc[:, col_list]
        # renaming columns
        df.rename(columns= {"Country Name":"Country", "Country Code":"Country_Code"}, inplace = True)
        # merging with countries_df to keep the Countries List same
        df = df_countries.merge(df, on=["Country_Code"], how="inner")
        df = df.drop(['Country_y'], axis=1)
        df.rename(columns= {"Country_x":"Country"}, inplace = True)
        # removing countries with NaN value in 2017
        df = df.dropna(axis=0, subset=subset)
        # Replace null values with 0
        df.fillna(0,inplace = True)
        return df


    # read World population Density data from https://datacatalog.worldbank.org into dataframe
    df_Density = pd.read_csv('static/data/populationDensity.csv')
    #  making list of necessary data
    col_list = [0,1,5,14,24,34,44,54,59,60,61,62]
    # Calling cleanData function with dataframe and column lists as parameters
    df_Density =cleanData(df_Density, col_list, ['2017'])



    # Cleaning csv Birth rate data from https://datacatalog.worldbank.org
    df_birth = pd.read_csv('static/data/birthRate.csv')
    #  making list of necessary data
    col_list = [0,1,4,14,24,34,44,54,59,60,61,62]
    # Calling cleanData function with dataframe and column lists as parameters
    df_birth =cleanData(df_birth, col_list, ['2018'])



    # Cleaning csv Death rate data from https://datacatalog.worldbank.org
    df_death = pd.read_csv('static/data/deathRate.csv')
    # Calling cleanData function with dataframe and column lists as parameters
    df_death = cleanData(df_death, col_list, ['2018'])



    # Cleaning csv sex Ratio data from https://datacatalog.worldbank.org
    df_sexRatio = pd.read_csv('static/data/sexRatio.csv')
    #  making list of necessary data
    col_list = [0,1,6,16,26,36,46,54,59,60,61,62]
    # Calling cleanData function with dataframe and column lists as parameters
    df_sexRatio = cleanData(df_sexRatio, col_list, ['2018'])
    #####################################################

    return [df_countries_merged, df_cityPop, df_worldPop, df_Density, df_birth, df_death, df_sexRatio]
# End of ETL_process function
#####################################################


# Loading Data into MongoDB
#####################################################
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

db_name = "populationDB"

# if database doesnot exists
if (bool(db_name in client.list_database_names()) == False):
    # Remove database if exists
    # client.drop_database(db_name)

    # Calling the ETL_process function
    df_list = ETL_process()

    # Creating Database and collection in mongodb
    db = client[db_name]
    countriesPop = db["countriesPopulation"]
    citiesPop = db["citiesPopulation"]
    worldPop = db["worldPopulation"]
    popDensity = db["populationDensity"]
    birRate = db["birthRate"]
    dthRate = db["deathRate"]
    sexRate = db["sexRatio"]

    # Function to insert Dataframes into mongodb collections
    def insertToDB(df, collection):
        data_dict = df.to_dict("records") # Convert to dictionary
        # removing index from data
        data_dict = [{k: v for k, v in d.items() if k != 'index'} for d in data_dict]
        collection.insert_one({"data":data_dict}) # Insert dict to collection


    # Calling function to insert each dataframes into mongoDB collections
    insertToDB(df_list[0], countriesPop)
    insertToDB(df_list[1], citiesPop)
    insertToDB(df_list[2], worldPop)
    insertToDB(df_list[3], popDensity)
    insertToDB(df_list[4], birRate)
    insertToDB(df_list[5], dthRate)
    insertToDB(df_list[6], sexRate)

    print(db.list_collection_names())
