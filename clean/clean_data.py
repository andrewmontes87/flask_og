import pandas as pd
import json
import LatLon
import re

revenue_df = pd.read_json('data/og_co_minibio.json')
loc_df = pd.read_json('data/og_co_loc.json')

# Clean revenues

def trim_asterisks(x):
    x = str(x)
    while x[-1] == '*':
        x = x[0:len(x)-2]
    return float(x)

revenue_df['revenue'] = revenue_df['revenue'].apply(lambda x: trim_asterisks(x))

# Clean coords

loc_df.ix[30, 'coordinate_location'] = "13 45'N, 100 31'E"

def convert_coords_string(x):

    # string2latlon('5 52 59.88 N', '162 4 59.88 W', 'd% %m% %S% %H')
    if '"' in x:
        latlon_filter = 'd% %m% %S% %H'
    else:
        latlon_filter = 'd% %m% %H'

    x = re.sub('[^a-zA-Z0-9 \n\.,]', ' ', x)

    x = x.split(',')
    x[1] = x[1].lstrip()

    x = LatLon.string2latlon(x[0], x[1], latlon_filter)

    return str(x)

loc_df['coordinate_location'] = loc_df['coordinate_location'].apply(lambda x: convert_coords_string(x))


# Merge

target_df = pd.merge(revenue_df, loc_df, how='outer', on='name', suffixes=('', '_y'),)

target_df = target_df.drop('link_y',axis=1)

target_df.to_json('../api/data/og_co_data.json', orient='records')

