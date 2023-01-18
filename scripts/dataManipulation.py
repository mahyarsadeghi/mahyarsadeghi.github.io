#%%
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
#%%
d_zip=df['Country'].unique()
countries = {}
for country in pycountry.countries:
    countries[country.name] = country.alpha_2

codes = [countries.get(country, country) for country in d_zip]
d_country=dict(zip(d_zip,codes))
print(d_country)
df['CountryCodes']=df['Country'].apply(lambda x: d_country[x])

#%%
# -- Chart 1 Geo Analysis --
result1 = df[['Country' ,'Sales ($)']]
result2 = result1.groupby('Country').sum().rename(columns={'Sales ($)': 'SalesForCountry'}).reset_index()
ordered_result = result2.sort_values(by='SalesForCountry', ascending=False)
ordered_result['Country Code'] = ordered_result['Country'].apply(lambda x: d_country[x])
print(ordered_result)
ordered_result.to_csv(f'{DATA_PATH}/SalesCountry.csv')

#%%
# -- Chart 2 Geo Analysis --
result1 = df[['Country' ,'TCU (unit)']]
result2 = result1.groupby('Country').sum().rename(columns={'TCU (unit)': 'TCUForCountry'}).reset_index()
ordered_result = result2.sort_values(by='TCUForCountry', ascending=False)
ordered_result['Country Code'] = ordered_result['Country'].apply(lambda x: d_country[x])
print(ordered_result)
ordered_result.to_csv(f'{DATA_PATH}/TCUCountry.csv')

#%%
# -- Chart 3 Geo Analysis --
result1 = df[['Country', 'TCU (unit)']] # remove the last line because is the total
# count the occurences of every country
result2 = result1.groupby('Country').count().rename(columns={'TCU (unit)': 'ArtistForCountry'}).reset_index()
# select only the top X and save into csv
ordered_result = result2.sort_values(by='ArtistForCountry', ascending=False)
ordered_result['Country Code'] = ordered_result['Country'].apply(lambda x: d_country[x])
print(ordered_result)
ordered_result.to_csv(f'{DATA_PATH}/ArtistPerCountry.csv', index=False)

#-------------------------------- Artist & Genre Analysis ----------------------------

#%%
# -- Chart 1 Artist & Genre Analysis --
result1 = df[['Country','Genre']]
top = 15
# convert to list
result1['Genre'] = result1['Genre'].str.split(' / ')

# convert list of pd.Series then stack it
result1 = (result1
.set_index(['Country'])['Genre']
 .apply(pd.Series)
 .stack()
 .reset_index()
 .drop('level_1', axis=1)
 .rename(columns={0:'Genre'}))

result1.Genre = result1.Genre.str.capitalize()
# print(result1)
result2 = result1.groupby('Genre').count().rename(columns={'Country': 'Count'}).reset_index()
ordered_result = result2.sort_values(by='Count', ascending=False)[:top]

all_genres = result2['Genre'].unique()
top_genres = list(ordered_result['Genre'])
other_genres = list(set(all_genres) - set(top_genres))
# print(len(other_genres))
final_result = ordered_result.append({'Genre': 'Other', 'Count': len(other_genres)}, ignore_index=True)
# print(final_result)
final_result.to_csv(f'{DATA_PATH}/top_{top}_genres.csv', index=False)

# # -- Chart 2 Artist & Genre Analysis --

#%%
# -- PART 1
result1 = df[['Sales ($)','Genre']]
top = 15

result1['Genre'] = result1['Genre'].str.split(' / ')

# convert list of pd.Series then stack it
result1 = (result1
.set_index(['Sales ($)'])['Genre']
 .apply(pd.Series)
 .stack()
 .reset_index()
 .drop('level_1', axis=1)
 .rename(columns={0:'Genre'}))

result1.Genre = result1.Genre.str.capitalize()
# print(result1)

result2 = result1.groupby('Genre').sum().rename(columns={'Sales ($)': 'SalesForGenre'}).reset_index()
ordered_result = result2.sort_values(by='SalesForGenre', ascending=False)[:top]
# print(ordered_result)

all_genres = result2['Genre'].unique()
top_genres = list(ordered_result['Genre'])
other_genres = list(set(all_genres) - set(top_genres))

others  = result1[result1['Genre'].isin(other_genres)]
othersSales = others['Sales ($)'].sum()

final_result = ordered_result.append({'Genre': 'Other', 'SalesForGenre': othersSales}, ignore_index=True)
print(final_result)
final_result.to_csv(f'{DATA_PATH}/top_{top}_genres_sales.csv', index=False)

#%%
# -- PART 2
result1 = df[['TCU (unit)','Genre']]
top = 15

result1['Genre'] = result1['Genre'].str.split(' / ')

# convert list of pd.Series then stack it
result1 = (result1
.set_index(['TCU (unit)'])['Genre']
 .apply(pd.Series)
 .stack()
 .reset_index()
 .drop('level_1', axis=1)
 .rename(columns={0:'Genre'}))

result1.Genre = result1.Genre.str.capitalize()
# print(result1)

result2 = result1.groupby('Genre').sum().rename(columns={'TCU (unit)': 'TCUForGenre'}).reset_index()
ordered_result = result2.sort_values(by='TCUForGenre', ascending=False)[:top]
# print(ordered_result)

all_genres = result2['Genre'].unique()
top_genres = list(ordered_result['Genre'])
other_genres = list(set(all_genres) - set(top_genres))

others  = result1[result1['Genre'].isin(other_genres)]
othersTCU = others['TCU (unit)'].sum()

final_result = ordered_result.append({'Genre': 'Other', 'TCUForGenre': othersTCU}, ignore_index=True)
print(final_result)
final_result.to_csv(f'{DATA_PATH}/top_{top}_genres_TCU.csv', index=False)


#%%
# -- Chart 3 Artist & Genre Analysis --
top = 20
result1 = df[['Artist', 'Sales ($)', 'TCU (unit)']]

ordered_result = result1.sort_values(by='Sales ($)', ascending=False)[:top]
# print(ordered_result)
ordered_result = ordered_result[['Artist', 'Sales ($)']]
ordered_result.to_csv(f'{DATA_PATH}/top_{top}_artists_sales.csv', index=False)

ordered_result2 = result1.sort_values(by='TCU (unit)', ascending=False)[:top]
ordered_result2 = ordered_result2[['Artist', 'TCU (unit)']]
# print(ordered_result2)
ordered_result2.to_csv(f'{DATA_PATH}/top_{top}_artists_TCU.csv', index=False)

# # -- Chart 4 Artist & Genre Analysis --

#%%
# -- PART 1
result1 = df[['Artist', 'Country', 'TCU (unit)','Sales ($)']]

countries = result1['Country'].unique()
final_result = pd.DataFrame(columns=['Artist', 'Country', 'TCU (unit)', 'Sales ($)'])

for country in countries:
    dd = result1[result1['Country'] == country]
    row = dd.sort_values(by='Sales ($)', ascending=False)[:1]
    final_result  = pd.concat([final_result, row])

print(final_result)
final_result.to_csv(f'{DATA_PATH}/top_artist_country.csv', index=False)

# -- PART 2
#%%
result1 = df[['Artist', 'Country','Sales ($)','TCU (unit)']]

countries = result1['Country'].unique()
final_result = pd.DataFrame(columns=['Artist', 'Country','Sales ($)', 'TCU (unit)'])

for country in countries:
    dd = result1[result1['Country'] == country]
    row = dd.sort_values(by='TCU (unit)', ascending=False)[:1]
    final_result  = pd.concat([final_result, row])

# print(final_result)
# final_result = final_result.sort_values(by='TCU (unit)', ascending=False)
final_result.to_csv(f'{DATA_PATH}/top_artist_countryTCU.csv', index=False)

# %%
#-------------------------------- Time Analysis ----------------------------

result1 = df[['Artist','Country', 'Sales ($)','TCU (unit)', 'Genre', 'period_active']]
result1['period_active'] = df['period_active'].str.replace('present', '2023').str.split(', ')

for i, row in result1.iterrows():
    if len(row.period_active) == 2:
        st1 = row.period_active[0].split('–')
        print(st1)
        st2 = row.period_active[1].split('–')
        print(st2)
        seq1 = list( range( int(st1[0]), int(st1[1])+1 ) )
        seq2 = list( range( int(st2[0]), int(st2[1])+1 ) )
        result1['period_active'][i] = seq1 + seq2
    
    else:
        st = row.period_active[0].split('–')
        seq = list( range( int(st[0]), int(st[1])+1 ) )
        result1['period_active'][i] = seq

# print(result1)
result1 = (result1
.set_index(['Artist','Country', 'Sales ($)','TCU (unit)', 'Genre'])['period_active']
 .apply(pd.Series)
 .stack()
 .reset_index()
 .drop('level_5', axis=1)
 .rename(columns={0:'period_active'}))

# result1.to_csv(f'{DATA_PATH}/timeData.csv', index=False)

# %%
# -- Chart 1 Time Analysis --
final_result = result1[['period_active']]
# final_result = final_result.sort_values(by='period_active', ascending=False)
# print(final_result)
final_result.to_csv(f'{DATA_PATH}/allYears.csv', index=False)

# %%
result1 = result1[['Artist','Country', 'Sales ($)','TCU (unit)', 'period_active', 'Genre']]
result1['Genre'] = result1['Genre'].str.split(' / ')
result1 = (result1
.set_index(['Artist','Country', 'Sales ($)','TCU (unit)', 'period_active'])['Genre']
 .apply(pd.Series)
 .stack()
 .reset_index()
 .drop('level_5', axis=1)
 .rename(columns={0:'Genre'}))

result1.Genre = result1.Genre.str.capitalize()
result1.to_csv(f'{DATA_PATH}/prova.csv', index=False)


var1 = result1[result1['Genre'] == 'Pop']
var2 = result1[result1['Genre'] == 'Rock']
final_result = pd.concat([var1, var2], axis=0)
# print(final_result)
final_result = final_result[['Genre', 'period_active']]
final_result.to_csv(f'{DATA_PATH}/PopRock_years.csv', index=False)

var3 = result1[result1['Genre'] == 'R&b']
var4 = result1[result1['Genre'] == 'Hip-hop']
final_result2 = pd.concat([var3, var4], axis=0)
# print(final_result2)
final_result2 = final_result2[['Genre', 'period_active']]
final_result2.to_csv(f'{DATA_PATH}/R&bHip-hop_years.csv', index=False)


var5 = result1[result1['Genre'] == 'Hard rock']
var6 = result1[result1['Genre'] == 'Pop rock']
final_result3 = pd.concat([var5, var6], axis=0)
# print(final_result2)
final_result3 = final_result3[['Genre', 'period_active']]
final_result3.to_csv(f'{DATA_PATH}/Hard rockPop rock_years.csv', index=False)

var7 = result1[result1['Genre'] == 'Country']
var8 = result1[result1['Genre'] == 'Soul']
final_result4 = pd.concat([var7, var8], axis=0)
# print(final_result2)
final_result4 = final_result4[['Genre', 'period_active']]
final_result4.to_csv(f'{DATA_PATH}/CountrySoul_years.csv', index=False)

var9 = result1[result1['Genre'] == 'Dance']
var10 = result1[result1['Genre'] == 'Alternative rock']
final_result5 = pd.concat([var9, var10], axis=0)
# print(final_result2)
final_result5 = final_result5[['Genre', 'period_active']]
final_result5.to_csv(f'{DATA_PATH}/DanceAlternative rock_years.csv', index=False)


# %%

result1 = result1[[ 'TCU (unit)', 'period_active', 'Genre']]
result1['Genre'] = result1['Genre'].str.split(' / ')
result1 = (result1
.set_index(['TCU (unit)', 'period_active'])['Genre']
 .apply(pd.Series)
 .stack()
 .reset_index()
 .drop('level_2', axis=1)
 .rename(columns={0:'Genre'}))
 
result1.Genre = result1.Genre.str.capitalize()

filtered_result = result1[result1['Genre'] == 'Pop']
result2 = filtered_result[['period_active', 'TCU (unit)']]
pop = result2.groupby('period_active').count().rename(columns={'TCU (unit)': 'Pop'}).reset_index()
print(pop)

filtered_result = result1[result1['Genre'] == 'Rock']
result2 = filtered_result[['period_active', 'TCU (unit)']]
rock = result2.groupby('period_active').count().rename(columns={'TCU (unit)': 'Rock'}).reset_index()
print(rock)


filtered_result = result1[result1['Genre'] == 'R&b']
result2 = filtered_result[['period_active', 'TCU (unit)']]
RB = result2.groupby('period_active').count().rename(columns={'TCU (unit)': 'R&b'}).reset_index()
print(RB)

filtered_result = result1[result1['Genre'] == 'Hip-hop']
result2 = filtered_result[['period_active', 'TCU (unit)']]
HipHop = result2.groupby('period_active').count().rename(columns={'TCU (unit)': 'Hip-hop'}).reset_index()
print(HipHop)

filtered_result = result1[result1['Genre'] == 'Country']
result2 = filtered_result[['period_active', 'TCU (unit)']]
country = result2.groupby('period_active').count().rename(columns={'TCU (unit)': 'Country'}).reset_index()
print(country)
# %%
# horizontal_concat = pd.concat([pop, rock, RB, HipHop, country], axis=1)
# print(horizontal_concat)
# horizontal_concat.to_csv(f'{DATA_PATH}/top_5_genres_trend.csv', index=False)
join1 = pop.merge(rock, on='period_active',how='outer', suffixes=('_1', '_2'))
join2 = join1.merge(RB, on='period_active',how='outer', suffixes=('_1', '_2'))
join3 = join2.merge(HipHop, on='period_active',how='outer', suffixes=('_1', '_2'))
join4 = join3.merge(country, on='period_active',how='outer', suffixes=('_1', '_2'))


display(join4)
join4.to_csv(f'{DATA_PATH}/top_5_genres_trend.csv', index=False)
# %%
