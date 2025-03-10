import pandas as pd

df = pd.read_csv('./weight-height.csv')

gender_array = df['Gender'].values
height_array = df['Height'].values
weight_array = df['Weight'].values

# print("Gender Array:", gender_array)
# print("Height Array:", height_array)
# print("Weight Array:", weight_array)

for i in range(len(gender_array)):
    if gender_array[i] == 'Male':
        gender_array[i] = 0
    else:
        gender_array[i] = 1

# for i in range(len(weight_array)):
    # weight_array[i] = weight_array[i] * 0.453592

height_data = height_array
weight_data = weight_array
height_weight_data = list(zip(weight_data, height_data))
gender_data = gender_array
# print(gender_data)
