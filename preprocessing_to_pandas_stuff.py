import os
import csv
import pandas as pd
import json

CLASSES = [
    "10A",
    "10B",
    "10C",
    "10D",
    "10E",
    "10F",
    "10G",
    "10H",
    "10I",
    "10J",
    "11A",
    "11B",
    "11C",
    "11D",
    "11E",
    "12A",
    "12B",
    "12C",
    "12D",
    "9A",
    "9B",
    "9C",
    "9D",
    "9E",
    "9F",
    "9G",
    "9H",
    "9I",
    "9J",
    "absentees",
    "candidates",
]


file_paths = [
    os.path.join(os.getcwd(), "class-wise", collection + ".csv")
    for collection in CLASSES
]
# since all files would have the same posts and candidates
with open("candidate-data.json", "r") as file:
    candidate_data = json.loads(file.read())


def compile_single_class(file_path: str):
    """compiles votes from single class's csv
    returns a dictionary alike
    {
        "Captain Boy": {
                "Aaditya": 10,...
        }
        "Captain Girl":...
        ...
    }

    """

    with open(file_path, "r") as file:
        reader = csv.reader(file)
        # skipping column names
        next(reader)

        candidates = {
            post: {name: 0 for name in names} for post, names in candidate_data.items()
        }
        for line in reader:
            post = line[0]
            name = line[1]
            votes = int(line[2])
            candidates[post][name] = votes

    return candidates


def compile_csvs_to_json():
    """compiles csvs of all classes into a single json/dict object
    returns dictionary alike
    {
        post1:{
            class1:{
                candidate1: votes,
                candidate2:votes...
            }
            class:2 {...},
            ...
        },
        post2:{...},
        ...
    }
    """

    compiled_json = {
        post_name: {
            class_name: {name: 0 for name in candidate_data[post_name]}
            for class_name in CLASSES
        }
        for post_name in candidate_data.keys()
    }

    for idx in range(len(CLASSES)):

        curr_class = CLASSES[idx]
        class_wise_votes = compile_single_class(file_paths[idx])

        for post, candidates in class_wise_votes.items():
            for name, votes in candidates.items():
                compiled_json[post][curr_class][name] += votes

    return compiled_json


def create_dataframes():
    compiled = compile_csvs_to_json()
    dataframes = {}


    for post in compiled:
        post_dataframe = pd.DataFrame(
            compiled[post]
        ).T  # transpose cuz otherwise there would be 31 columns
        dataframes[post] = post_dataframe
        
    return dataframes
