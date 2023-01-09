import json
import pandas as pd
import pycountry
import geopandas as gpd
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

DATA_PATH = '../data'

df = pd.read_csv(f'{DATA_PATH}/best_selling_artists.csv')
# print(df)


#           ------- Geo Analysis -------
d_zip=df['Country'].unique()
countries = {}
for country in pycountry.countries:
    countries[country.name] = country.alpha_2

codes = [countries.get(country, country) for country in d_zip]
d_country=dict(zip(d_zip,codes))
print(d_country)
df['CountryCodes']=df['Country'].apply(lambda x: d_country[x])

# -- Chart 2 Geo Analysis --
result1 = df[['Country' ,'TCU (unit)']]
result2 = result1.groupby('Country').sum().rename(columns={'TCU (unit)': 'TCUForCountry'}).reset_index()
ordered_result = result2.sort_values(by='TCUForCountry', ascending=False)
ordered_result['Country Code'] = ordered_result['Country'].apply(lambda x: d_country[x])
print(ordered_result)
ordered_result.to_csv(f'{DATA_PATH}/TCUCountry.csv')

# -- Chart 3 Geo Analysis --
result1 = df[['Country', 'TCU (unit)']] # remove the last line because is the total
# count the occurences of every country
result2 = result1.groupby('Country').count().rename(columns={'TCU (unit)': 'ArtistForCountry'}).reset_index()
# select only the top X and save into csv
ordered_result = result2.sort_values(by='ArtistForCountry', ascending=False)
ordered_result['Country Code'] = ordered_result['Country'].apply(lambda x: d_country[x])
print(ordered_result)
ordered_result.to_csv(f'{DATA_PATH}/ArtistPerCountry.csv', index=False)