import pandas as pd
import re

DATA_PATH = '../data'

columns_to_read = ['Country', "Year", "Genre", "Sales ($)"]
# genres_set = {'R&B', 'pop', 'rock', 'Country', 'rock and roll', 'gospel', 'Hip-hop', 'neo soul', 'Alternative rock',
#               'J-pop', 'Hard rock', 'heavy metal', 'dance', 'Latin pop', 'hip house', 'EDM', 'Pop rock', 'Soul', 'jazz',
#               'blues', 'soft rock'}

temp_genre = []
df = pd.read_csv(f'{DATA_PATH}/best_selling_artists.csv', usecols=columns_to_read)
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

df.to_csv(f'{DATA_PATH}/TA_CH_2.csv', index=False)
print(df.to_string())
