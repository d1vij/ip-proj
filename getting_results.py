import pymongo
import csv
import os

# 🙏 pls dont do anything w/ my cluster
CONNECTION_URL = "mongodb+srv://vermadivij:elections@cluster1.kicphp2.mongodb.net/?retryWrites=true&w=majority&appName=cluster1"
DATABASE_NAME = "votes"

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


def fetch_and_parse(collection_name: str) -> dict:
    """fetches vote collections from mongodb server"""
    
    
    conn = pymongo.MongoClient(CONNECTION_URL)
    database = conn.get_database(DATABASE_NAME)

    RESULTS: dict[str, dict[str, int]] = {}

    collection = database.get_collection(collection_name)
    found_documents: list[dict] = list(collection.find({}))

    for doc in found_documents:
        vote_data: list[dict[str, str]] = doc["vote_data"]

        for vote_obj in vote_data:
            post = vote_obj["post"]
            voted_candidate = vote_obj["name"]
            if post not in RESULTS:
                RESULTS[post] = {}

            # post exists
            RESULTS[post][voted_candidate] = RESULTS[post].get(voted_candidate, 0) + 1

    return RESULTS


def save_to_csv(data: dict, path:str):
    with open(path, "w+") as file:
        writer = csv.writer(file)
        writer.writerow(["Post", "Candidate", "Total Votes"])
        for postname, candidates in data.items():
            for name, votes in candidates.items():
                writer.writerow([postname, name, votes])


if __name__ == "__main__":
    """
    converting json to csv to again json is redundant and indivisual collections could directly be compiled to final json
    """
    
    BASE_DIR = os.path.join(os.path.dirname(os.getcwd()), "ip-project", "class-wise")

    for collection in CLASSES:
        try:
            save_to_csv(fetch_and_parse(collection), path=os.path.join(BASE_DIR, collection+".csv"))
            print(f"Saved collection : {collection}")
        except Exception as e:
            print(f"Exception occured in saving {collection} document, Exception: {e}")
