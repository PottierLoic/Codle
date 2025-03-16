import firebase_admin
from firebase_admin import credentials, firestore
import json

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

with open("data/languages.json", "r", encoding="utf-8") as file:
  languages = json.load(file)

def upload_languages():
  for lang in languages:
    db.collection("languages").document(lang["name"]).set(lang)
    print(f"Uploaded: {lang['name']}")

if __name__ == "__main__":
  upload_languages()
  print("All languages uploaded successfully!")