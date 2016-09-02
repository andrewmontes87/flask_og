import os

URL_PREFIX = 'api'
X_DOMAINS = '*'
HATEOAS = False
PAGINATION = False

MONGO_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/og_co')
# MONGO_DBNAME = 'og_co'
DOMAIN = { 
    'og_co':{
        'item_title':'og_co_record',
        'schema':{
            'link':{'type':'string'},
            'country':{'type':'string'},
            'headquarters_location':{'type':'string'},
            'name':{'type':'string'},
            'coordinate_location':{'type':'string'},
            'bio_img':{'type':'string'},
            'image_urls':{'type':'array'},
            'revenue':{'type':'string'},            
            'inception':{'type':'string'},            
            'instance_of':{'type':'string'},            
            'isin':{'type':'string'},            
        },
        'url':'og_co'
    }
}
