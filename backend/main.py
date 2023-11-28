from dotenv import load_dotenv, find_dotenv
import os 
import pprint
from pymongo import MongoClient

load_dotenv(find_dotenv())

password = os.environ.get("MONGODB_PWD")

connection_string = f"""mongodb+srv://azhitkev:{password}@capstone.8mdcviu.mongodb.net/"""

client = MongoClient(connection_string)

dbs = client.list_database_names()
#how to connect to a specific database 
test_db = client.capstoneDB
#lists out all collections
collections = test_db.list_collection_names()
print(collections)

def insert_test_doc():
    collection = test_db.test
    test_document = {
        "name": "Tim",
        "type": "Test"
    }
    inserted_id = collection.insert_one(test_document).inserted_id
    print(inserted_id)