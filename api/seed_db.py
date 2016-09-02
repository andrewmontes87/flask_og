import json
from pymongo import MongoClient
from settings import MONGO_URI

OG_CO = 'og_co'

og_co = json.load(open('data/og_co_data.json'))

mc = MongoClient(MONGO_URI)
db = mc.get_default_database()

db[OG_CO].drop()
db[OG_CO].insert_many(og_co)

print('Seeded the database with %d og_co'%db.og_co.count())