import pandas as pd
import re
import numpy as np


DATA_PATH = '../data'

columns_to_read = ['Country', "Year", "Genre", "Sales ($)"]

temp_genre = []
df = pd.read_csv(f'{DATA_PATH}/best_selling_artists_ORIGINAL.csv', usecols=columns_to_read)
df_genres = df['Genre']
for row in df_genres:
    genres = row.split(' / ')
    for i in genres:
        temp_genre.append(i.lower())

genres_unique_set = set(temp_genre)
# print(genres_unique_set)
dropped_indexes = []
for index, row in df.iterrows():
    # print(row, "======>", index)
    temp_genres = re.split(r' / |/ | /', row["Genre"])
    if len(temp_genres) != 1:
        for i in temp_genres:
            temp_salary = 0
            string_genre = i.lower()
            salary = row["Sales ($)"].replace("million", "").split(" ")
            # Taking the max of the salary- First index is always max
            temp_salary = salary[0]

            df = df.append(
                {"Country": row.Country, "Year": row.Year, "Genre": string_genre, "Sales ($)": temp_salary},
                ignore_index=True)
        dropped_indexes.append(index)
    else:
        temp_salary = 0
        salary = row["Sales ($)"].replace("million", "").split(" ")
        temp_salary = salary[0]
        df.at[index, 'Genre'] = temp_genres[0].lower()
        df.at[index, "Sales ($)"] = temp_salary
df = df.drop(dropped_indexes)
df['Sales ($)'] = df['Sales ($)'].astype(float)

prova = df[['Country', 'Genre', 'Year']]
prova1 = prova.groupby(by=['Country', 'Genre']).min().rename(columns={'Year': 'startYear'}).reset_index()
prova2 = prova.groupby(by=['Country', 'Genre']).max().rename(columns={'Year': 'endYear'}).reset_index()
endYear = prova2['endYear']
prova1['endYear'] = endYear
prova1 = prova1[prova1["Genre" ].isin(['pop', 'rock', 'r&b', 'hip-hop', 'country'])]
prova1 = prova1[prova1["Country" ].isin(['United States', 'United Kingdom', 'Canada', 'Barbados', 'Trinidad and Tobago'])]
prova1.to_csv(f'{DATA_PATH}/prova.csv', index=False)
# Group By and pivot
df2 = df.groupby(by=["Country", "Genre"], as_index=False)['Sales ($)'].sum()

df2 = df2.pivot(index="Country", columns="Genre", values="Sales ($)")
df2=df2.reset_index()
# print(df2.columns)

df1 = df.pivot_table(index=["Year"], columns="Genre", values="Sales ($)", aggfunc=np.sum)
# df2 = df.pivot_table(index=["Country"], columns="Genre", values="Sales ($)", aggfunc=np.sum)
df2 = df2.fillna(0)
df1 = df1.fillna(0)
# print(df1.head(1))

# df2.to_csv(f'{DATA_PATH}/TA_CH_3.csv', index=False)
# df1.to_csv(f'{DATA_PATH}/TA_CH_2.csv', index=True)


# test:
# df=pd.read_csv(DATA_PATH+"/TA_CH_3.csv")
# print(df.columns)
# df.to_csv(f'{DATA_PATH}/TA_CH_3.csv', index=True)
