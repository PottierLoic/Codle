import firebase_admin
from firebase_admin import credentials, firestore
import json

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

with open("data/snippets.json", "r", encoding="utf-8") as file:
  snippets = json.load(file)

for i, snippet in enumerate(snippets):
  doc_ref = db.collection("codeSnippets").document(f"snippet_{i+1}")
  doc_ref.set(snippet)

print("All code snippets uploaded successfully!")
