

def compile_single_class(file_path: str):
    with open(file_path, "r") as file:
        reader = csv.reader(file)

        # skipping column names row
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


def save_to_csv(data: dict, path: str):
    # create path if it doesnt exists
    if not (os.path.exists(path)):
        open(path, "x").close()

    with open(path, "w+") as file:

        writer = csv.writer(file)
        writer.writerow(["Post", "Candidate", "Total Votes"])

        for postname, candidates in data.items():
            for name, votes in candidates.items():
                writer.writerow([postname, name, votes])



def compile_csvs_to_json():

    # empty dictionary to store the compiled vote data
    compiled_json = {
        post_name: {
            class_name: {name: 0 for name in candidate_data[post_name]}
            for class_name in CLASSES
        }
        for post_name in candidate_data.keys()
    }

    for curr_class in CLASSES:
        class_wise_votes = compile_single_class(
            os.path.join(os.getcwd(), "class-wise", curr_class + ".csv")
        )
        for post, candidates in class_wise_votes.items():
            for name, votes in candidates.items():
                compiled_json[post][curr_class][name] += votes

    return compiled_json

# NOTE: converting json to csv to again json is redundant and indivisual collections could directly be compiled to final json
BASE_DIR = os.path.join(os.path.dirname(os.getcwd()), "ip-proj", "class-wise")

if not (os.path.exists("class-wise")):
    os.mkdir("class-wise")

for collection in CLASSES:

    # try to save that collection
    try:
        save_to_csv(
            fetch_and_parse(collection),
            os.path.join(BASE_DIR, collection + ".csv"),
        )
        print(f"Saved collection : {collection}")

    # gracefully handle any raised exception
    except Exception as e:
        print(f"Exception occured in saving {collection} document, Exception: {e}")