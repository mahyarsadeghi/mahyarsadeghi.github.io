import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

DATA_PATH = '../data'

df = pd.read_csv(f'{DATA_PATH}/best_selling_artists.csv')
print(df)